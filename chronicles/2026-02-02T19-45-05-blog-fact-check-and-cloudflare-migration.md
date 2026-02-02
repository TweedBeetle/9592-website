---
date: 2026-02-02T19:45:05
title: Blog Fact-Check and Cloudflare Migration
type: progress
tags: [blog, content, infrastructure, cloudflare]
author: "Claude"
ai_generated: true
ai_model: "claude-opus-4-5-20251101"
---

## Summary

Three rounds of fact-checking on the AI support blog post, followed by verification of Cloudflare DNS migration.

## What Was Done

### Blog Post Fact-Checking (3 rounds)

**Round 1** (previous session): Fixed MIT/HBR citation mix-up, converted footnotes to named identifiers.

**Round 2**: Comprehensive review from external AI model identified issues:
- 78%/391% headline stats had weak primary sourcing
- LVMH conversion claim unsubstantiated
- Resolution rates overclaimed (80%+)
- Freshworks cost numbers not in source

**Decision**: Chose "Option B" - switch from precise statistics with weak sourcing to directional claims that let the conservative math carry the argument. Changes:
- Replaced specific stats with qualitative claims ("first responder wins disproportionately")
- Removed unsubstantiated numbers
- Made resolution rates qualitative ("often half or more")
- Kept the 62% SMB missed calls stat with study context (defensible)

**Round 3**: Final review caught two more issues:
- Klarna timeline: "late 2024" → "2025" (factual correction)
- Gen Z 84% stat: removed unsupported percentage, kept qualitative claim

### Cloudflare Migration Verification

User switched nameservers from Hover to Cloudflare. Verified:
- ✅ Nameservers propagated (anahi/rodrigo.ns.cloudflare.com)
- ✅ SSL working (cert from Google Trust Services via CF edge)
- ✅ Cloudflare proxy active (cf-ray headers present)
- ✅ Vercel backend serving (x-vercel-cache: HIT)
- ✅ MX records intact (Google Workspace)
- ✅ Response times ~140ms

## Key Decisions

**Directional claims over precise stats**: For content marketing credibility, it's better to make defensible qualitative claims than cite specific numbers from weak sources. The conservative math example (one customer/month at $3K = $36K/year) carries more weight than questionable industry stats.

**Turnstile vs domain migration**: Clarified that Cloudflare Turnstile (CAPTCHA) works standalone on any host - no need to migrate domain to Cloudflare just for bot protection on specific actions.

## Implications

- Blog post is now citation-tight after 3 review rounds
- Cloudflare provides path to bot protection/rate limiting when needed for cost-per-visitor features
- Infrastructure section added to project CLAUDE.md documenting the setup
