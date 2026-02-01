---
date: 2026-02-01T15:08:10
title: Mixpanel Analytics Integration
type: progress
tags: [analytics, mixpanel, infrastructure]
author: "Claude"
ai_generated: true
ai_model: "claude-opus-4-5-20251101"
---

## Summary

Added Mixpanel analytics to 9592.tech as alternative to Vercel Analytics (which has no REST API).

## Background

Wanted programmatic access to website analytics. Investigated Vercel Analytics first:
- No REST API exists (requested since April 2023, still open: vercel/analytics#68)
- Vercel Drains can forward analytics but requires Pro plan
- Decided to use Mixpanel instead (free tier: 20M events/month, has API)

## What Was Done

1. **Created Mixpanel project** via browser automation (Chrome MCP)
   - Initially created in EU region (ID: 3986099)
   - Discovered MCP regional restriction issue
   - Deleted EU project and recreated in US for simpler MCP access

2. **Final project configuration (US)**
   - Project: "9592-website" (ID: 3986106)
   - Data residency: US
   - Timezone: Europe/Berlin
   - Organization: 9592
   - Token: `7bf933aa178f53606b6072703d1d86d9`

3. **Integrated tracking in Layout.astro**
   - Initially used legacy snippet loader (bloated, ugly)
   - User questioned why it was so complex
   - Checked Context7 for modern approach
   - Replaced with clean ES module pattern using importmap

4. **Deployed to production** and verified events flowing

## Technical Details

**Clean ES module approach (US region, no api_host needed):**
```html
<script type="importmap">
  { "imports": { "mixpanel-browser": "https://cdn.mxpnl.com/libs/mixpanel-js/dist/mixpanel.module.js" } }
</script>
<script type="module">
  import mixpanel from 'mixpanel-browser';
  mixpanel.init('7bf933aa178f53606b6072703d1d86d9', {
    track_pageview: true,
    persistence: 'localStorage'
  });
</script>
```

**Key gotcha discovered:** Mixpanel MCP is US-only by default. EU projects return "Regional access restriction" error. Since 9592.tech has no GDPR requirement for EU data residency, recreated in US for simpler setup.

## Implications

- Can now query analytics programmatically via Mixpanel MCP (standard US endpoint)
- Dashboard: https://mixpanel.com/project/3986106
- Events tracked: page views with geo, device, browser info
- Free tier sufficient for personal website traffic
