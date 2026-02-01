---
date: 2026-02-01T16:22:44
title: Blog Citation Fix and Footnote Refactor
type: progress
tags: [blog, content, quality]
author: "Claude"
ai_generated: true
ai_model: "claude-opus-4-5-20251101"
---

## Summary

Fixed a misattributed citation in the AI support blog post and converted all footnotes to named identifiers for easier future editing.

## What Was Done

### Citation Fix

The claim "Responding within 5 minutes makes you 21x more likely to qualify a lead compared to responding in 30 minutes" was attributed to the HBR article "The Short Life of Online Sales Leads" but that article doesn't contain this statistic.

**HBR article actually says:**
- 7x more likely when responding within 1 hour vs 1+ hours
- 60x more likely when responding within 1 hour vs 24+ hours

**The 21x statistic** comes from the MIT Lead Response Management Study, which specifically analyzed 5-minute vs 30-minute response windows.

Updated citation from HBR to MIT/InsideSales.com source.

### Footnote Refactor

Converted all 12 numbered footnotes to named identifiers:

| Old | New |
|-----|-----|
| `[^1]` | `[^first-responder]` |
| `[^2]` | `[^missed-calls]` |
| `[^3]` | `[^mit-study]` |
| `[^4]` | `[^four-seasons]` |
| `[^5]` | `[^air-canada]` |
| `[^6]` | `[^ai-abandonment]` |
| `[^7]` | `[^cosmopolitan-rose]` |
| `[^8]` | `[^gucci]` |
| `[^9]` | `[^henn-na-hotel]` |
| `[^10]` | `[^dpd-chatbot]` |
| `[^11]` | `[^chevy-tahoe]` |
| `[^12]` | `[^emoticons-luxury]` |

Markdown footnotes with named identifiers auto-number based on order of first appearance, so adding a citation mid-article no longer requires manual renumbering.

## Implications

- Future blog posts should use named footnotes from the start
- The pattern is now demonstrated in `src/content/blog/ai-support-premium-service-businesses.mdx`
- Citation accuracy matters for credibility; worth spot-checking sources when claims seem specific
