---
date: 2026-02-01T15:55:40
title: Mixpanel Funnel Tracking
type: progress
tags: [analytics, mixpanel, tracking]
author: "Claude"
ai_generated: true
ai_model: "claude-opus-4-5-20251101"
---

## Summary

Extended Mixpanel analytics with UTM attribution, CTA click tracking, and footnote engagement tracking. Enables full funnel analysis from campaign source to conversion.

## Background

After migrating Mixpanel from EU to US region (see previous chronicle), user wanted to track:
- Where visitors come from (UTM parameters)
- What they click on (CTAs, external links, downloads)
- Engagement depth (footnote clicks on blog posts)

## What Was Done

### 1. UTM Parameter Tracking

Added super property registration for UTM params:
```js
const params = new URLSearchParams(window.location.search);
['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(key => {
  const val = params.get(key);
  if (val) utmProps[key] = val;
});
if (Object.keys(utmProps).length) mixpanel.register(utmProps);
```

Super properties persist across all events in the session, so UTM attribution flows through to CTA clicks.

### 2. CTA Click Tracking

Single event listener using event delegation:

| Type | Triggers on |
|------|-------------|
| `email` | `mailto:` links |
| `external` | Links to other domains |
| `download` | `.pdf` files |
| `internal` | Internal navigation (`/blog`, etc.) |

### 3. Footnote Engagement

Tracks clicks on footnote references in blog posts:
- `to_footnote`: Clicking [1], [2] in text
- `back_to_text`: Clicking ↩ to return

## Verification

Tested via MCP queries:
- UTM tracking: Confirmed `utm_source=test` captured on page views
- CTA Click: Confirmed `type=email` event registered
- All events queryable via standard Mixpanel MCP (US region)

## Implications

**Funnels now possible:**
```
Page View (utm_source=google) → CTA Click (type=email)
Page View → Footnote Click → CTA Click
```

**Events tracked:**
- `$mp_web_page_view` - automatic page views
- `CTA Click` - with `type`, `url`/`path`/`file`/`email` properties
- `Footnote Click` - with `footnote_id`, `direction` properties

**Dashboard:** https://mixpanel.com/project/3986106
