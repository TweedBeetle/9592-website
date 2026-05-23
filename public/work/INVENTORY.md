# /work screenshot inventory (FEATURE C1)

Anonymized demonstrator screenshots for the `/arbeiten` ↔ `/en/work` case studies
(PLAN C1). Two demonstrators: an offer map (public-facing) and an editorial CMS
(back-office workflow). Captured from the demos' running local servers via
`scripts/capture-work-screenshots.mjs` (Playwright). Re-run:

```bash
# offer map: serve the demo, then capture
cd ~/projects/kne-angebotslandkarte-demo && npm run preview      # :4173
cd ~/projects/9592-website && node scripts/capture-work-screenshots.mjs offer-map

# CMS: seed local D1, serve, then capture
cd ~/projects/kne-cms-demo && npm run db:reset && npm run pages:dev   # :8788
cd ~/projects/9592-website && node scripts/capture-work-screenshots.mjs cms
```

All 11 images below were **visually inspected by reading each file**. Every one
is confirmed free of the findings §4.5 strip-list: no `Kompetenznetz
Einsamkeit` / `KNE`, no `ISS`, no `Angebotslandkarte gegen Einsamkeit` title, no
`gegen Einsamkeit` / loneliness framing, no `~1.600 entries` copy, no demo-URL
bars, no buyer logo/footer. Filenames and the suggested alt text below contain
zero strip-list terms.

---

## Anonymization method (per image, and why)

The plan's preference order: element-level / clipped capture > post-blur.
**Nothing here is blurred.** Two clean-exclusion techniques were used:

1. **Clip to the clean region** (offer map). The only identifying chrome in the
   offer-map SPA is the page `<header>` (title `Angebotslandkarte gegen
   Einsamkeit` + subtitle `Kompetenznetz Einsamkeit (KNE)`) and the
   `demo-disclosure` `<footer>` (which names `KNE-Einträgen` and `~1.600
   Einträge`). The map renders correctly only with the page layout intact, so
   the header/footer are kept in the DOM and excluded by clipping the screenshot
   to the union of the filter strip + map region (header is above the clip's top
   edge, footer below its bottom). The filter vocabulary (Modalität: Telefonisch
   / Digital / Vor Ort; Zielgruppe: Familien / Jugendliche / Senior:innen / alle
   Altersgruppen) is generic and carries no buyer identity.

2. **Capture-time DOM text-replacement** (CMS). The CMS embeds buyer-identifying
   tokens *interleaved* with content that the shot must show: the header `KNE
   CMS Demo`, the persona label `KNE-Redakteurin`, the audit-log actor
   `KNE-REDAKTION`, and the editor account domain `kompetenznetz-einsamkeit`.
   Clipping cannot exclude an actor label sitting in the middle of an audit
   timeline, and blurring would leave it legible. Instead the capture script
   rewrites these tokens in the rendered DOM (text nodes only, never
   attributes/classes/hrefs) to the agreed generic framing before each shot:
   `Kompetenznetz Einsamkeit` → `Beratungsnetzwerk`, `KNE-…` → `…` (so
   `KNE-REDAKTION` → `REDAKTION`, `KNE CMS Demo` → `CMS Demo`), standalone
   `Einsamkeit` → `Isolation`, and parenthetical internal `(Konzept §x)`
   document references are dropped. This is a transform inside this repo's
   capture script, not an edit to the demo repo, and it is the anonymization
   sanctioned by VISION decision 2. A per-shot residual-token check
   (`Kompetenznetz|KNE|Einsamkeit|ISS|1.600`) ran clean for every CMS image.

The CMS seed data is otherwise synthetic: org/contributor names are
Mustermann-style (`Brigitte Müller`, `Dr. Katrin Behrens`, `Trauernetz Hannover
gGmbH`) and all email domains are `*.example.org`. The offer-map data is real
scraped support offers (generic org names like `KeinerBleibtAllein`); the only
two entries whose text contains the word `Einsamkeit` (in Nürnberg and
Paderborn) were deliberately excluded from the list-view shot by scoping it to a
Berlin radius.

---

## Offer-map demonstrator (5 images)

| File | Caption (neutral) | Suggested alt text (EN) | Suggested alt text (DE) |
|------|-------------------|-------------------------|-------------------------|
| `offer-map-overview.png` | Country-wide map with category-aware marker clustering. | Interactive offer map of Germany with clustered location markers; each cluster shows the number of offers it contains. | Interaktive Angebotskarte von Deutschland mit gebündelten Standort-Markern; jeder Cluster zeigt die Anzahl der enthaltenen Angebote. |
| `offer-map-filters.png` | Filtering by modality and target group narrows the map live. | Offer map with the filter bar showing active modality and target-group filters; the clustered markers update to the filtered subset. | Angebotskarte mit der Filterleiste, in der Modalitäts- und Zielgruppen-Filter aktiv sind; die Cluster aktualisieren sich auf die gefilterte Teilmenge. |
| `offer-map-radius.png` | Postal-code and radius search with a visible search circle. | Offer map showing a postal-code radius search: a 50-kilometre search circle around a city centre with the matching markers inside it. | Angebotskarte mit Umkreissuche nach Postleitzahl: ein 50-Kilometer-Suchradius um ein Stadtzentrum mit den darin liegenden Markern. |
| `offer-map-list.png` | Accessible list view as an equal-rank alternative to the map. | Offer map with the list-view panel open beside it, presenting the same results as a keyboard- and screen-reader-accessible list. | Angebotskarte mit geöffnetem Listen-Panel daneben, das dieselben Ergebnisse als tastatur- und screenreader-zugängliche Liste darstellt. |
| `offer-map-mobile.png` | Responsive mobile layout: stacked filter controls above the map. | The offer map on a phone-width screen: the filter controls stack vertically above the map. | Die Angebotskarte auf einem Smartphone-Bildschirm: die Filtersteuerung stapelt sich vertikal über der Karte. |

**Not captured — `offer-map-nationwide.png`:** the requested "nationwide-offers
surface" (a dedicated area for offers without a single address) **does not exist
as a distinct UI in this prototype** (no such surface or string in the built
app; the seeded offers all carry an address). This is an absent feature, not an
anonymization failure. The remaining five shots cover the offer map's
demonstrated capabilities. Flagged for the orchestrator: if a nationwide surface
is wanted in the case study, it would need building in the demo first.

---

## Editorial-CMS demonstrator (6 images)

| File | Caption (neutral) | Suggested alt text (EN) | Suggested alt text (DE) |
|------|-------------------|-------------------------|-------------------------|
| `editorial-personas.png` | Demo persona switch (public / contributor / editor) above the public list. | Editorial CMS header with a demo persona selector for the public view, a contributor, and an editor, above the public list of published offers. | Kopfzeile des Redaktions-CMS mit einer Demo-Persona-Auswahl für öffentliche Ansicht, Eintragende und Redaktion, über der öffentlichen Liste veröffentlichter Angebote. |
| `editorial-submit.png` | Contributor submission: the five-step offer form with conditional fields. | A contributor's five-step "new offer" form, on the first step, with title, description, category and target-group selectors. | Das fünfstufige Formular „Neues Angebot" der Eintragenden, im ersten Schritt, mit Titel, Beschreibung, Kategorie und Zielgruppen-Auswahl. |
| `editorial-intake-queue.png` | Editor intake queue: a submitted offer expanded for review. | The editor's intake queue showing a submitted offer expanded into a preview, with publish, return-with-note and edit actions. | Die Eingangs-Queue der Redaktion mit einem zur Vorschau ausgeklappten eingereichten Angebot und Aktionen zum Veröffentlichen, Zurücksenden und Bearbeiten. |
| `editorial-diff.png` | Change request shown as a before/after field diff. | A change request to a published offer, shown as a before-and-after comparison of the title and description fields. | Ein Änderungswunsch zu einem veröffentlichten Angebot, dargestellt als Vorher-Nachher-Vergleich der Felder Titel und Beschreibung. |
| `editorial-audit-log.png` | Audit log: the full state-transition timeline for one offer. | The audit log for a single offer: a chronological timeline of state transitions (created, submitted, published) with actor and timestamp. | Das Audit-Log eines einzelnen Angebots: eine chronologische Zeitleiste der Statusübergänge (erstellt, eingereicht, veröffentlicht) mit Akteur und Zeitstempel. |
| `editorial-reminders.png` | Reminder pipeline: generated reminder emails in the preview outbox. | The reminder pipeline's preview outbox: generated reminder emails for an offer across the day-0 / 30 / 60 / 90 escalation stages. | Der Vorschau-Postausgang der Reminder-Pipeline: erzeugte Reminder-Mails für ein Angebot über die Eskalationsstufen Tag 0 / 30 / 60 / 90. |

---

*Generated by FEATURE C1. Capture script: `scripts/capture-work-screenshots.mjs`.
No demo-repo source was modified. CMS local D1 was seeded fresh
(`npm run db:reset`) before capture.*
