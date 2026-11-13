---
date: 2026-11-13T11:50:02
title: Services Lines on Agencies Live
type: progress
author: "Claude"
ai_generated: true
ai_model: "claude-opus-5-5"
session_id: 5b14ba77-f751-4b99-bafb-e813b3349dc7
---

## Summary

The services pages (EN /en/services, DE /de/leistungen) no longer refuse agency work or working inside a client's team. Christo approved the wording on his phone at 10:55, and it is deployed as a1765ba.

## What Was Done

- **Why it changed.** Christo decided twice that these lines change. On 12 Nov, on the English CV's open points, he said "Change those two lines on the site, and link the work page until that is done". On 13 Nov at 09:17 he said "37a — Change the lines on both pages before the first agency application". The reasons: his CV now names AI coding agents as a skill, which "I do the technical work myself" contradicted. His German project profile goes to agencies, which "no agency or intermediary" and "Entwicklerüberlassung in fremden Prozessen" refused. It also blocked finding-work ticket 018 (the first agency application) and the freelancermap sign-up.
- **What the source showed.** Checking the source confirmed that the German page carries its own version of "I do the technical work myself". So both pages got the same three changes:
  - The opening sentence now says "responsible for the technical work, from the first prototype through to the system in production" (DE: "ich verantworte die technische Arbeit vom ersten Prototyp bis in den laufenden Betrieb"). This mirrors the CV's own claim and says nothing about agents, so it holds whatever finding-work ticket 021 settles about how he describes his part.
  - The contracting paragraph now says "I usually contract directly with the client. I also work through agencies, or as part of a client's own team." Direct work stays the norm, so the page does not read as a new preference.
  - The developer-time item is removed from what he does not offer.
- **Writing checks.** natural-writing and voice-playbook ran on the draft, and the prose-lint t0+t1 scan was clean. The reviewer raised two findings. One was a miscounted summary line, which was fixed. The other asked whether the homepage line "you have one contracting party, and there is nobody in between" changes too. That went to Christo as for-you item 1 with the pick to leave it, and he answered "r", so it stays.
- **Review round.** The round was "Services lines on agencies" (08ed6555f763, native page, opened with `--kind outward --no-conduct-block "site copy, no counterparty"`). He gave lgtm from his phone with no notes. The file was byte-identical to the reviewed commit 7f5ef0a.
- **Deploy.** The approved sentences were applied to the two .astro files. The built HTML was checked for every approved sentence and for the absence of the old lines. The change was pushed to main, which Vercel deploys, and the live pages were checked by fetch. One early fetch still showed the old English text (an edge-cache race); a re-fetch a few seconds later showed the new text with and without a cache-bust. The pages were not checked visually; only text inside existing elements changed.
- **Hand-offs.**
  - finding-work-b4 was told by SendMessage on `uds:/tmp/cc-socks/1785.sock` (its name was not reachable from this profile). Its CV header can now link the home page again.
  - The site queue item moved from Inbox to Current state (memex d3daa106e).
  - A new RULINGS.md in this repo holds the four rulings verbatim, with a pointer from CLAUDE.md.

## Steering

Christo did not touch the wording; he approved the first draft as written. His one decision was to leave the homepage line, on the session's recommendation that it describes what a direct client gets and refuses nothing.

## Implications

The agency path is open from the site's side. The CV header switch back to the home page and the first agency application are finding-work's.

## Open Threads

- The homepage line stays as it is by his choice. If agency work becomes a large share, it is worth re-reading.
- The meta description ("One developer, direct contracting" / "Ein Entwickler, Direktvertrag") was left unchanged as still true for direct buyers.
- After the edit, the reviewer's stored prediction found 1 finding but put 0 proposals on the page. The `--christo` decision had been recorded on the pre-edit hash and did not carry to the new bytes, so the homepage question reached him only through the for-you record. This is a possible review-rounds gap, not investigated.
