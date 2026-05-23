#!/usr/bin/env node
// Capture + anonymize demonstrator screenshots for the /arbeiten case studies.
//
// Drives the two demo SPAs (offer-map + editorial CMS) through Playwright and
// writes anonymized PNGs to ~/projects/9592-website/public/work/.
//
// Anonymization strategy (PLAN C1 + findings §4.5 STRIP-LIST):
//   - Identifying chrome (page title "Angebotslandkarte gegen Einsamkeit",
//     "Kompetenznetz Einsamkeit (KNE)" subtitle, the ~1.600-KNE-entries
//     disclosure footer) is HIDDEN via injected CSS before each shot. This is
//     clean exclusion at capture time, not a demo-repo source edit and not a
//     post-hoc blur. The map / filter UI / workflow surfaces remain.
//   - Data risk: only 2 offer-map entries contain "Einsamkeit"
//     (scrape-023 Nürnberg, scrape-031 Paderborn). List/detail shots are scoped
//     to a region (Berlin) that excludes both.
//
// This script does NOT modify either demo repo. It only reads their running
// preview servers. Playwright resolves from the offer-map demo's node_modules,
// so run it with that repo as cwd (the orchestrator does this).
//
// Usage:
//   OFFERMAP_URL=http://localhost:4173 node capture-work-screenshots.mjs offer-map
//   CMS_URL=http://localhost:8788      node capture-work-screenshots.mjs cms

import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createRequire } from 'node:module';

// Playwright is not a dependency of 9592-website. Resolve it from a repo that
// has it installed (the offer-map demo ships playwright + chromium). Override
// with PLAYWRIGHT_FROM if needed. This keeps the capture script in this repo
// without adding a heavy devDep here.
const PW_FROM = process.env.PLAYWRIGHT_FROM
  || '/Users/christo/projects/kne-angebotslandkarte-demo/node_modules/';
const require = createRequire(PW_FROM.endsWith('/') ? PW_FROM : PW_FROM + '/');
const { chromium, devices } = require('playwright');

const OUT_DIR = '/Users/christo/projects/9592-website/public/work';
const OFFERMAP_URL = process.env.OFFERMAP_URL || 'http://localhost:4173';
const CMS_URL = process.env.CMS_URL || 'http://localhost:8788';

// Retina: DPR 2. 1280×860 viewport → 2560×1720 image. Crisp, reasonable size.
const DESKTOP = { width: 1280, height: 860 };
const DPR = 2;
const PHONE = devices['iPhone 14']; // 390×844 @ DPR 3

// Compute the union bounding box (CSS px) of one or more selectors, so we can
// clip a screenshot to exactly the strip+map region and leave the identifying
// header (above the strip) and disclosure footer (below the map) out of frame.
// MapLibre renders correctly only when the page layout is intact, so we keep
// the chrome in the DOM and exclude it by clipping rather than by hiding it.
async function unionClip(page, selectors) {
  return page.evaluate((sels) => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const s of sels) {
      const el = document.querySelector(s);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top);
      x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom);
    }
    // Clamp to the viewport so the clip never exceeds the rendered area.
    x0 = Math.max(0, x0); y0 = Math.max(0, y0);
    x1 = Math.min(window.innerWidth, x1);
    y1 = Math.min(window.innerHeight, y1);
    return { x: Math.round(x0), y: Math.round(y0), width: Math.round(x1 - x0), height: Math.round(y1 - y0) };
  }, selectors);
}

async function shoot(target, name, opts = {}) {
  const path = resolve(OUT_DIR, name);
  if (opts.locator) {
    await opts.locator.screenshot({ path });
  } else {
    await target.screenshot({ path, fullPage: false, clip: opts.clip });
  }
  console.log(`  → ${name}`);
}

async function waitOfferMapReady(page) {
  await page.waitForFunction(
    () => Boolean(window.__kneFilters && window.__kneFilters.state && window.__kneFilters.elements),
    { timeout: 20000 },
  );
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r())));
}

// Selectors: header (page title + KNE subtitle) and demo-disclosure footer are
// the only identifying chrome. The filter strip + map (#main) are clean.
const STRIP = '#kne-filter-strip';
const MAIN = '#main';

async function captureOfferMap(browser) {
  console.log('OFFER-MAP captures');

  async function newDesktop() {
    const ctx = await browser.newContext({ viewport: DESKTOP, deviceScaleFactor: DPR, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(OFFERMAP_URL, { waitUntil: 'networkidle' });
    await waitOfferMapReady(page);
    return { ctx, page };
  }

  // 1. Overview — all markers clustered across Germany, cluster counts visible.
  {
    const { ctx, page } = await newDesktop();
    await page.waitForTimeout(1400); // OSM raster tiles settle
    await shoot(page, 'offer-map-overview.png', { clip: await unionClip(page, [STRIP, MAIN]) });
    await ctx.close();
  }

  // 2. Filters — filter strip with two active chips + filtered, clustered map.
  {
    const { ctx, page } = await newDesktop();
    await page.evaluate(() => {
      const click = (group, value) => {
        const c = Array.from(document.querySelectorAll('.kne-chip')).find(
          (b) => b.dataset.group === group && b.dataset.value === value,
        );
        if (c) c.click();
      };
      click('modality', 'analog');      // "Vor Ort"
      click('zielgruppe', 'Senior:innen');
    });
    await page.waitForTimeout(1400);
    await shoot(page, 'offer-map-filters.png', { clip: await unionClip(page, [STRIP, MAIN]) });
    await ctx.close();
  }

  // 3. Radius/PLZ search — radius circle + fitBounds around a city.
  {
    const { ctx, page } = await newDesktop();
    await page.fill('.kne-plz__input', '10115');     // Berlin Mitte
    await page.selectOption('.kne-plz__select', '50');
    await page.click('.kne-plz__submit');
    await page.waitForFunction(
      () => { const m = window.__kneMap; return Boolean(m && m.getLayer && m.getLayer('plz-radius-fill')); },
      { timeout: 6000 },
    );
    await page.waitForTimeout(1600);
    await shoot(page, 'offer-map-radius.png', { clip: await unionClip(page, [STRIP, MAIN]) });
    await ctx.close();
  }

  // 4. Accessible list view — scoped to Berlin (excludes the 2 "Einsamkeit"
  //    entries in Nürnberg/Paderborn) so the rendered list is strip-list clean.
  {
    const { ctx, page } = await newDesktop();
    await page.fill('.kne-plz__input', '10115');
    await page.selectOption('.kne-plz__select', '25');
    await page.click('.kne-plz__submit');
    await page.waitForTimeout(900);
    await page.evaluate(() => {
      const b = Array.from(document.querySelectorAll('#kne-filter-strip button')).find(
        (x) => /Liste anzeigen/i.test(x.textContent),
      );
      if (b) b.click();
    });
    await page.waitForFunction(
      () => { const l = document.querySelector('#kne-list-view'); return l && !l.hidden && l.querySelector('*'); },
      { timeout: 6000 },
    );
    await page.waitForTimeout(900);
    await shoot(page, 'offer-map-list.png', { clip: await unionClip(page, [STRIP, MAIN]) });
    await ctx.close();
  }

  // 5. Mobile — phone viewport. The demo's mobile layout stacks the responsive
  //    filter controls above a short map (mobile micro-UX is out of the
  //    prototype's scope). Clip to strip+map: shows the mobile-first filter UI
  //    with a map peek, dropping the header + disclosure footer.
  {
    const ctx = await browser.newContext({ ...PHONE, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(OFFERMAP_URL, { waitUntil: 'networkidle' });
    await waitOfferMapReady(page);
    await page.waitForTimeout(1600);
    await shoot(page, 'offer-map-mobile.png', { clip: await unionClip(page, [STRIP, MAIN]) });
    await ctx.close();
  }
}

// ── CMS demo ───────────────────────────────────────────────────────────────
// The CMS embeds buyer-identifying tokens in body text (header "KNE CMS Demo",
// persona "KNE-Redakteurin", audit actor "KNE-REDAKTION", and any
// "kompetenznetz-einsamkeit" string). We neutralize these in the rendered DOM
// at capture time to the agreed generic framing ("Beratungsnetzwerk"). This is
// a transform in this capture script, not an edit to the demo repo, and it is
// the agreed anonymization (VISION decision 2), applied surgically to text
// nodes only (never attributes/classes/hrefs).
const CMS_NEUTRALIZE = () => {
  const repl = (s) => s
    .replace(/Kompetenznetz[\s-]Einsamkeit/g, 'Beratungsnetzwerk')
    .replace(/kompetenznetz-einsamkeit/g, 'beratungsnetzwerk')
    .replace(/Kompetenznetz/g, 'Beratungsnetzwerk')
    .replace(/KNE[\s-]?/g, '')           // KNE-REDAKTION→REDAKTION, "KNE CMS"→"CMS"
    .replace(/Einsamkeit/g, 'Isolation')
    .replace(/einsamkeit/g, 'isolation')
    // Drop internal bid-document references ("(Konzept §4.4)") — not buyer-naming
    // but they hint at a formal tender/proposal context the case study avoids.
    .replace(/\s*\(Konzept[^)]*\)/g, '');
  if (!document.body) return;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const n of nodes) {
    if (n.nodeValue && /Kompetenznetz|kompetenznetz|KNE|[Ee]insamkeit|\(Konzept/.test(n.nodeValue)) {
      n.nodeValue = repl(n.nodeValue);
    }
  }
};

// Assert no strip-list token survives in the visible text of the area we shoot.
const CMS_STRIPCHECK = () => {
  const t = document.body.innerText;
  const hits = (t.match(/Kompetenznetz|kompetenznetz|KNE|[Ee]insamkeit|\bISS\b|1\.600/g) || []);
  return hits;
};

async function captureCms(browser) {
  console.log('CMS captures');
  const ctx = await browser.newContext({ viewport: DESKTOP, deviceScaleFactor: DPR, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(CMS_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const dismissTour = async () => {
    await page.evaluate(() => {
      const byText = (re) => Array.from(document.querySelectorAll('button')).find((b) => re.test(b.textContent));
      const nm = byText(/Nicht mehr zeigen/); if (nm) nm.click();
      const cl = byText(/Tour schließen/); if (cl) cl.click();
    });
    await page.waitForTimeout(200);
  };
  const setPersona = async (value) => {
    await page.evaluate((v) => {
      const r = Array.from(document.querySelectorAll('input[type=radio]')).find(
        (x) => (x.getAttribute('aria-label') || x.value) === v);
      if (r) { r.click(); r.checked = true; r.dispatchEvent(new Event('change', { bubbles: true })); }
    }, value);
    await page.waitForTimeout(700);
  };
  const goHash = async (h) => { await page.evaluate((x) => { location.hash = x; }, h); await page.waitForTimeout(800); };
  // Transient toast overlays ("Demo-Persona gewechselt …") auto-dismiss after a
  //  few seconds. Wait for that; as a fallback, HIDE (never remove) any small
  //  positioned element still showing the toast text. Guarded so structural
  //  elements (body/main/header/…) are never touched.
  const dismissToasts = async () => {
    await page.waitForFunction(
      () => !/Demo-Persona gewechselt/.test(document.body?.innerText || ''),
      { timeout: 3500 },
    ).catch(() => {});
    await page.evaluate(() => {
      const STRUCT = new Set(['HTML', 'BODY', 'MAIN', 'HEADER', 'FOOTER', 'NAV', 'SECTION', 'ARTICLE']);
      for (const el of Array.from(document.querySelectorAll('*'))) {
        if (STRUCT.has(el.tagName)) continue;
        if (el.children.length > 3) continue;
        if (!/Demo-Persona gewechselt/.test(el.textContent || '')) continue;
        const pos = getComputedStyle(el).position;
        if (pos === 'fixed' || pos === 'absolute' || pos === 'sticky') el.style.display = 'none';
      }
    });
  };
  const neutralizeAndCheck = async (label) => {
    await dismissToasts();
    await page.evaluate(CMS_NEUTRALIZE);
    const hits = await page.evaluate(CMS_STRIPCHECK);
    if (hits.length) console.log(`  ! ${label}: residual strip-list tokens after neutralize: ${JSON.stringify(hits)}`);
    return hits;
  };

  await dismissTour();

  // Reset demo state to a pristine seed before capturing (idempotent).
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find((x) => /Demo-Zustand zurücksetzen/.test(x.textContent));
    if (b) b.click();
  });
  await page.waitForTimeout(1500);
  await dismissTour();

  // 1. Persona switch — public view: header with the 3-persona selector + list.
  await setPersona('oeffentlich');
  await dismissTour();
  await page.waitForTimeout(400);
  await neutralizeAndCheck('personas');
  await shoot(page, 'editorial-personas.png', { clip: { x: 0, y: 0, width: DESKTOP.width, height: 560 } });

  // 2. Contributor submission — the 5-step "Neues Angebot" form.
  await setPersona('eintragende');
  await goHash('#/eintragen/neu');
  await dismissTour();
  await neutralizeAndCheck('submit');
  await shoot(page, 'editorial-submit.png', { locator: page.locator('main') });

  // 3. Editor intake queue — submitted entries; expand the first for detail.
  await setPersona('redakteurin');
  await goHash('#/redaktion/eingang');
  await dismissTour();
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('main a, main button')).find((x) => /▸/.test(x.textContent));
    if (b) b.click();
  });
  await page.waitForTimeout(500);
  await neutralizeAndCheck('intake-queue');
  await shoot(page, 'editorial-intake-queue.png', { clip: { x: 0, y: 0, width: DESKTOP.width, height: 860 } });

  // 4. Change queue with before/after diff.
  await goHash('#/redaktion/aenderung');
  await dismissTour();
  await neutralizeAndCheck('diff');
  {
    const card = page.locator('.aenderung-card').first();
    await shoot(page, 'editorial-diff.png', { locator: card });
  }

  // 5. Audit log — chronological state-transition timeline for one entry.
  await goHash('#/redaktion/veroeffentlicht');
  await dismissTour();
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('main a, main button')).find((x) => /^Audit-?Log$/.test(x.textContent.trim()));
    if (b) b.click();
  });
  await page.waitForTimeout(900);
  await neutralizeAndCheck('audit-log');
  await shoot(page, 'editorial-audit-log.png', { locator: page.locator('main') });

  // 6. Reminder pipeline — trigger the preview run on the published list, then
  //    capture the top of the preview outbox (intro + the first entry's four
  //    reminder stages: Tag 0 / 30 / 60 / 90). The full outbox is ~10k px tall
  //    (every published entry × four stages), so we clip the top region rather
  //    than element-screenshot the whole list.
  await goHash('#/redaktion/veroeffentlicht');
  await dismissTour();
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('main button')).find((x) => /Nur Reminder-Previews erzeugen/.test(x.textContent));
    if (b) b.click();
  });
  await page.waitForTimeout(3500); // pipeline runs + previews generate
  await goHash('#/redaktion/postausgang');
  await dismissTour();
  await page.waitForFunction(
    () => /Reminder Tag/.test(document.querySelector('main')?.innerText || ''),
    { timeout: 8000 },
  ).catch(() => {});
  await page.waitForTimeout(500);
  await neutralizeAndCheck('reminders');
  await shoot(page, 'editorial-reminders.png', { clip: { x: 0, y: 0, width: DESKTOP.width, height: 900 } });

  await ctx.close();
}

async function main() {
  const target = process.argv[2] || 'offer-map';
  await mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  try {
    if (target === 'offer-map') await captureOfferMap(browser);
    else if (target === 'cms') await captureCms(browser);
    else if (target === 'all') { await captureOfferMap(browser); await captureCms(browser); }
    else throw new Error(`unknown target: ${target}`);
  } finally {
    await browser.close();
  }
  console.log('Done.');
}

main().catch((e) => { console.error(e); process.exit(1); });
