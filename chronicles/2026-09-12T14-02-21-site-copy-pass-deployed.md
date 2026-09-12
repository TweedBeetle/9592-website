---
date: 2026-09-12T14:02:21
title: Site Copy Pass Shipped
type: progress
author: "Claude"
ai_generated: true
ai_model: "claude-opus-5"
session_id: d60aa4ea-d1fc-45d7-8fdc-b76abe0c15f7
---

## Summary

Rewrote the marketing copy across both locales ("de-sloppify and improve my website"), found
four substantive errors under the style work, deployed to production, and cleared a CLAUDE.md
staleness flag the nightly had raised eight times since June.

## What Was Done

Copy commit `ad70fc3`, 10 page/component files, pushed and live within ~45 seconds.

**Errors that were not style.** The style brief was the entry point, but most of the value was
in things that were simply wrong:

- `/en/services` mixed first person and the corporate "we" — "I deliver custom working software"
  in one section, "We build for EU data handling" and "What we do not do" in the next. Cause:
  the 2026-05-23 fixpass logged fix m3 as "Leistungen voice unified to 'Ich'" and only touched
  the German file. The English twin kept the mixed voice through a full independent pre-deploy
  review and four months of live serving.
- The DE homepage headed its writing section "Schreiben" (the *act* of writing) and described
  the blog as software "die in der Produktion funktioniert" — German for manufacturing, not
  production systems. The DE blog index had "im echten Betrieb" correct the whole time, which is
  what made the homepage version visible as an error rather than a preference.
- The reply-time promise read "within a day" on three EN surfaces against "innerhalb eines
  Werktags" on DE. The EN form was both inconsistent and a harder promise than the DE one.
- The Jeeves card said the assistant was "trained on 400+ videos from @jeeves_ny". It is not
  trained on them. On a page selling technical judgment to technical buyers, that is the claim a
  reader would price in.

**Style.** The load-bearing finding was repetition, not vocabulary: the site made its one real
differentiator three times in three progressively vaguer forms (hero "a working demonstrator you
can inspect for yourself"; homepage services "a working prototype, not slide decks: core
deliverables are inspectable before award"; services page "It begins with working software, not
slide decks or capability statements"). Each restatement was more abstract than the last, and
all three went abstract exactly where the reader decides whether the offer is different — the
hard-moment failure from natural-writing. Now stated once, plainly, with the services section
carrying something the hero does not (who evaluates the prototype, and when).

Also removed: the self-introduction two inches under an H1 that already gives the name; bare
comma-list card subtitles; the staccato "Not a customer project, not a product" on the work
index and both case studies; verbless fragments; "oriented to WCAG 2.1 AA" (Germanism);
"I will gladly give you access" → "I'd be happy to". Deliberately cut "I'll tell you honestly,
even when the answer is no" for "I'll say so before we start" — the original is
virtue-by-contrast (nobody defends the alternative) and the replacement commits to a *when*.

The four practice-area cards on the services page had bodies that restated their own titles
("Internal tools → Tools for internal processes and teams"). Four of four were pure foam; they
now describe the work.

Left alone: the two case-study narratives. They are the best prose on the site — specific, dry,
naming real mechanisms.

**Verification.** Build clean; `prose-lint` clean on the rendered English (its one finding was
an artifact of concatenating five pages, each carrying a single "Thanks!"); zero em dashes in
the rendered output; screenshots of EN home, EN services and DE home read rather than trusting
the diff. Post-deploy the checks were re-run against the *served* pages rather than the local
build, since Vercel builds independently: 8/8 URLs 200, zero "we" on `/en/services`, DE fixes
live, zero em dashes. Pa11y was not re-run and that was stated rather than glossed — text-only
change, no markup or token edits.

## Steering

Christo's whole brief was one sentence ("Use natural writing and impeccable skill to
de-sloppify and improve my website") and his only other input was "push". No wording was
contested, so the learn step's posthoc `/voice-calibrate` path correctly did not fire — there
were no draft-to-revision deltas from him to calibrate against.

The one judgment call worth recording: the commit was deliberately held unpushed and the deploy
surfaced as his decision, because push auto-deploys to the live site. He answered with a single
word, which suggests the gate was the right shape but did not need much ceremony around it.

## Implications

The recurring structural risk this surfaced is that `/de/*` and `/en/*` are hand-authored twins
whose body copy shares nothing but `src/i18n/` chrome. A fix in one locale does not reach the
other, and neither the build nor the Pa11y gate can see the drift — it took four months and a
full review pass for the mixed-voice English page to be caught, by reading rather than by any
check. Captured as a Gotchas entry in `CLAUDE.md`: every copy change names both files, and DE
copy gets a false-friend read against the German already live elsewhere on the site.

Two stale-doc corrections landed alongside: `npm run preview` was documented as working when the
Vercel adapter has no preview command, and the §Planned block still read "**NOT yet deployed**"
while listing B1/M1/G1/G3 as gating — all discharged months earlier (B1+M1 in `09304a1`). That
block had survived eight nightly flags because closing it needed a human-session edit and no
nightly is scoped to make one. It is now §Status, pointing at `PLAN.md` and the queue file.

The recurring Framer "fix your Cloudflare proxy settings" alert was resolved `--standing` after
a live re-verify (www serves 200 from Vercel behind Cloudflare, zero "framer" in the HTML). It
had been adjudicated from scratch twice before (inc-e59c2a, inc-2c9e9f) because neither prior
resolution carried the flag.

## Open Threads

Nothing is blocking and nothing is owed. Optional, in rough order of value:

- The blog posts were not touched this pass. Seven of them carry the same authorial habits the
  page copy did; whether that matters depends on whether they are read as essays or as SEO
  surface.
- The site's meta descriptions were tidied where I was already in the file, but not audited as a
  set.
- Pa11y has not been run since G2 (2026-05-23). Nothing since then should have moved it, and
  this pass certainly did not, but the gate's last measurement is now ~4 months old.
