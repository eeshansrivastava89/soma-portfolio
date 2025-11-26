# Build Log Enhancements

**Goal**: Reframe `/build-with-me/` → `/build-log/` as solo-first learning journey with optional contribution.

**Package location**: `packages/build-log/`

---

## Prioritized Enhancement List

| Rank | Enhancement | Why It Matters | Effort | Status |
|------|-------------|----------------|--------|--------|
| **1** | **Activity Feed** — Recent claims/merges/opens with avatars | Creates momentum, social proof. | Medium | ✅ Done |
| **2** | **Hero Rewrite** — Stats bar, manifesto copy, video CTA | First impression sells the vision. | Low | ✅ Done |
| **3** | **Task Enrichment** — "You'll Learn" tags, "Good First Issue" badge | Makes tasks interesting. | Medium | ✅ Done |
| **4** | **Recently Merged / Shoutouts** — Contributor credit | Public credit = motivation. | Low | ✅ Done |
| **5** | **Leaderboard Upgrades** — Streak indicators | Gamification drives return visits. | Medium | ✅ Done |
| **6** | **Filter Pills** — Quick filters | Reduces friction. | Low | ✅ Done |
| **7** | **Start Here Guide** — Collapsible onboarding | Answers "how do I start?" | Low | ✅ Done |
| **8** | **Video Modal** — Overlay player | Visual learners. | Medium | ✅ Done |
| **9** | **Quick Nav Bar** — Section links | Navigation + scanability. | Low | ✅ Done |
| **10** | **Mobile Polish** — Responsive fixes | Critical for social sharing. | Medium | ✅ Done |
| **11** | **Route Rename** — `/build-with-me/` → `/build-log/` | Matches new branding. | Low | ✅ Done |
| **12** | **Build Log Reframe** — Reorder: Hero → Projects → Learnings → Contribute | 80/20 split. | Medium | ⬜ Not started |
| **13** | **Latest Learnings Section** — Blog post links | Content is the engine. | Low | ⬜ Not started |
| **14** | **Current Projects Section** — What's live, stats | Showcase before asking for help. | Low | ⬜ Not started |
| **15** | **Hero Copy Update** — "The Build Log" framing | Solo-first, AI-native. | Low | ⬜ Not started |
| **16** | **PostHog Tracking [Later]** — CTA clicks, scroll | Data to optimize. | Low | ⬜ Later |

---

## Progress Log

### Route Rename Complete ✅
**Completed:** 2025-11-27

**Summary:** Full rename from `build-with-me` → `build-log` including folder, package name, and all internal references.

**Changes:**
- Renamed folder: `packages/build-with-me/` → `packages/build-log/`
- Package name: `@soma/build-with-me` → `@soma/build-log`
- Astro config: `base: '/build-log'`, `outDir: '../../dist/build-log'`
- Dockerfile: Added `/build-log/` nginx location block
- Root package.json: `dev:bwm` → `dev:build-log`
- Header.astro: Nav link updated to `/build-log`
- Internal files renamed:
  - `build-with-me-config.js/ts` → `build-log-config.js/ts`
  - `build-with-me-data.json` → `build-log-data.json`
  - `validate-build-with-me.ts` → `validate-build-log.ts`
  - `BuildWithMeView.tsx` → `BuildLogView.tsx`
- All imports updated across 10+ component files

### Major Redesign: Design Consolidation ✅
**Completed:** 2025-11-25

**Summary:** Consolidated 3 sections into unified `ContributorCards`. Removed competitive elements.

**Key changes:**
- `ContributorCards.tsx`: Unified contributor display
- `index.astro`: Hero redesign with video, quick nav pills
- `StartHereGuide.tsx`: Always-visible expand/collapse
- `VideoModal.tsx`: Video overlay
- Deleted: `LeaderboardTable.tsx`, `Shoutouts.tsx`, `DataFreshness.tsx`
- React 19 upgrade

---

## Next Up: Build Log Reframe (Items 12-15)

### Page Structure Target

```
/build-log/ page layout:

1. Hero — "The Build Log" (AI-native journey, solo-first)
2. Current Projects — A/B Simulator card with status, stats, "Try it" CTA
3. Latest Learnings — Blog post links (empty state until first post)
4. Want to Contribute? — GitHub issues table (existing TasksTable)
5. Contributors — Credit section (existing ContributorCards)
```

### Copy Drafts

**Hero:**
- Title: The Build Log
- Subtitle: Learning AI-native product development in public — and documenting everything.
- Body: I'm building full-stack products with AI tools, then doing data science on real user data. Everything is open: the code, the decisions, the mistakes.
- CTAs: "See Current Project" / "Want to Contribute?"

**Current Projects:**
- Section Title: What I'm Building
- A/B Simulator card: ✅ Live, stack pills, "Try It →" CTA

**Learnings:**
- Section Title: What I've Learned
- Empty state: "First build log post coming soon. Explore the code on GitHub."

### Implementation Notes

- Keep all existing React components — just restructure layout in `index.astro`
- Add new sections (Projects, Learnings) above TasksTable
- Move TasksTable + ContributorCards lower (20% section)
- Update hero copy

---
