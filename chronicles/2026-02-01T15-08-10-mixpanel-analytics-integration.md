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
   - Project: "9592-website" (ID: 3986099)
   - Data residency: EU
   - Timezone: Europe/Berlin
   - Organization: 9592
   - Token: `595d752a2d50d0b7585c6aee33d30bc7`

2. **Integrated tracking in Layout.astro**
   - Initially used legacy snippet loader (bloated, ugly)
   - User questioned why it was so complex
   - Checked Context7 for modern approach
   - Replaced with clean ES module pattern using importmap

3. **Deployed to production** and verified events flowing

## Technical Details

**Clean ES module approach:**
```html
<script type="importmap">
  { "imports": { "mixpanel-browser": "https://cdn.mxpnl.com/libs/mixpanel-js/dist/mixpanel.module.js" } }
</script>
<script type="module">
  import mixpanel from 'mixpanel-browser';
  mixpanel.init('TOKEN', {
    api_host: 'https://api-eu.mixpanel.com',  // Required for EU data residency
    track_pageview: true,
    persistence: 'localStorage'
  });
</script>
```

**Key gotcha discovered:** Mixpanel MCP is US-only by default. EU projects return "Regional access restriction" error. Need to configure `mcp-eu.mixpanel.com` for EU projects.

## Implications

- Can now query analytics programmatically via Mixpanel MCP (once EU region configured)
- Dashboard: https://eu.mixpanel.com/project/3986099
- Events tracked: page views with geo, device, browser info
- Free tier sufficient for personal website traffic
