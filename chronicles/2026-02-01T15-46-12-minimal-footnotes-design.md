---
date: 2026-02-01T15:46:12
title: Minimal Footnotes Design
type: progress
tags: [design, blog, css]
author: "Claude"
ai_generated: true
ai_model: "claude-opus-4-5-20251101"
---

## Summary

Redesigned blog footnotes section with a minimal aesthetic, improving usability and visual consistency.

## What Was Done

### Design Exploration

Used the frontend-design skill to create 4 distinct footnotes variations in an isolated worktree:

1. **V1 Editorial** - Magazine-inspired with serif accents, prominent blue numbers
2. **V2 Minimal** - Ultra-stripped, relies on whitespace (selected)
3. **V3 Technical** - Code-editor aesthetic with monospace, bordered container
4. **V4 Cards** - Card-based layout with individual bordered items

User selected V2 Minimal with modifications.

### Final Design

Applied to `src/pages/blog/[...slug].astro`:

- **Header**: Uppercase "FOOTNOTES" in small tertiary color (0.7rem, letter-spacing)
- **Layout**: Flex with 1em gap between numbers and content
- **Numbers**: CSS counter with tabular-nums, tertiary color
- **Source links**: Secondary color, turn blue (#3b82f6) on hover
- **Backrefs**: Always visible (not hover-to-reveal), larger click targets with padding, blue highlight on hover

### Key Decisions

- Backrefs visible by default for better discoverability
- Larger click targets (0.35em × 0.5em padding) for easier mobile use
- Unified hover behavior (both links and backrefs turn blue)
- Tighter spacing (1em vs 1.5em) for better visual connection

## Implications

- Blog posts now have polished, intentional footnotes styling
- Consistent with site's "minimalist, not minimal" design philosophy
- Better UX for readers navigating between content and sources
