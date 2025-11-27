# Build Log Enhancements

**Goal**: Reframe `/build-with-me/` → `/build-log/` as solo-first learning journey with optional contribution.

**Package location**: `packages/build-log/`

---

## Prioritized Enhancement List

| Rank | Enhancement | Why It Matters | Effort | Status | Issue |
|------|-------------|----------------|--------|--------|-------|
| **1** | **Activity Feed** — Recent claims/merges/opens with avatars | Creates momentum, social proof. | Medium | ✅ Done | [#15](https://github.com/eeshansrivastava89/soma-portfolio/issues/15) |
| **2** | **Hero Rewrite** — Stats bar, manifesto copy, video CTA | First impression sells the vision. | Low | ✅ Done | [#15](https://github.com/eeshansrivastava89/soma-portfolio/issues/15) |
| **3** | **Task Enrichment** — "You'll Learn" tags, "Good First Issue" badge | Makes tasks interesting. | Medium | ✅ Done | [#12](https://github.com/eeshansrivastava89/soma-portfolio/issues/12) |
| **4** | **Recently Merged / Shoutouts** — Contributor credit | Public credit = motivation. | Low | ✅ Done | [#15](https://github.com/eeshansrivastava89/soma-portfolio/issues/15) |
| **5** | **Leaderboard Upgrades** — Streak indicators | Gamification drives return visits. | Medium | ✅ Done | [#12](https://github.com/eeshansrivastava89/soma-portfolio/issues/12) |
| **6** | **Filter Pills** — Quick filters | Reduces friction. | Low | ✅ Done | [#15](https://github.com/eeshansrivastava89/soma-portfolio/issues/15) |
| **7** | **Start Here Guide** — Collapsible onboarding | Answers "how do I start?" | Low | ✅ Done | [#15](https://github.com/eeshansrivastava89/soma-portfolio/issues/15) |
| **8** | **Video Modal** — Overlay player | Visual learners. | Medium | ✅ Done | [#15](https://github.com/eeshansrivastava89/soma-portfolio/issues/15) |
| **9** | **Quick Nav Bar** — Section links | Navigation + scanability. | Low | ✅ Done | [#15](https://github.com/eeshansrivastava89/soma-portfolio/issues/15) |
| **10** | **Mobile Polish** — Responsive fixes | Critical for social sharing. | Medium | ✅ Done | [#15](https://github.com/eeshansrivastava89/soma-portfolio/issues/15) |
| **11** | **Route Rename** — `/build-with-me/` → `/build-log/` | Matches new branding. | Low | ✅ Done | [#23](https://github.com/eeshansrivastava89/soma-portfolio/issues/23) |
| **12** | **Build Log Reframe** — Reorder: Hero → Projects → Learnings → Contribute | 80/20 split. | Medium | ✅ Done | [#24](https://github.com/eeshansrivastava89/soma-portfolio/issues/24) |
| **13** | **Latest Learnings Section** — Blog post links | Content is the engine. | Low | ✅ Done | [#25](https://github.com/eeshansrivastava89/soma-portfolio/issues/25) |
| **14** | **Current Projects Section** — What's live, stats | Showcase before asking for help. | Low | ✅ Done | [#26](https://github.com/eeshansrivastava89/soma-portfolio/issues/26) |
| **15** | **Hero Copy Update** — "The Build Log" framing | Solo-first, AI-native. | Low | ✅ Done | [#27](https://github.com/eeshansrivastava89/soma-portfolio/issues/27) |
| **16** | **PostHog Tracking [Later]** — CTA clicks, scroll | Data to optimize. | Low | ⬜ Later | — |
| **17** | **Learnings YAML + Schema** — Data file with VS Code auto-complete | Single source of truth for posts. | Low | ⬜ Not started | [#28](https://github.com/eeshansrivastava89/soma-portfolio/issues/28) |
| **18** | **Learnings Timeline Component** — Timeline view with type badges | Shows continuity + frequency. | Medium | ⬜ Not started | [#29](https://github.com/eeshansrivastava89/soma-portfolio/issues/29) |
| **19** | **Learnings Filter + Pagination** — Project filter pills, 10/page | Scales as content grows. | Medium | ⬜ Not started | [#30](https://github.com/eeshansrivastava89/soma-portfolio/issues/30) |
| **20** | **Contribute Page** — Move contribution sections to `/build-log/contribute/` | Keeps Build Log focused on journey. | Medium | ⬜ Not started | [#31](https://github.com/eeshansrivastava89/soma-portfolio/issues/31) |
| **21** | **Header Nav Update** — Add "Contribute" link | Discoverable contribution path. | Low | ⬜ Not started | [#32](https://github.com/eeshansrivastava89/soma-portfolio/issues/32) |

---

## Progress Log

### Build Log 80/20 Reframe ✅
**Completed:** 2025-11-27

**Summary:** Restructured page with solo-first messaging (80%) before contribution section (20%).

**Changes:**
- Hero: New solo-first copy + CTAs ("See Current Project" / "Want to Contribute?")
- Added "What I'm Building" section with A/B Simulator card
- Added "What I've Learned" section (empty state for now)
- Moved contribution section below with border separator
- Stats bar moved to contribute section header

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

## What's Next: Learnings Timeline + Contribute Page (Items 17-21)

### Learnings Timeline Architecture

**Data source:** `packages/shared/src/data/learnings.yaml`

```yaml
- title: "How I Built the A/B Simulator"
  url: "/blog/how-i-built-the-ab-simulator"
  type: blog  # blog | substack | doc | video
  project: ab-sim
  tags: [react, statistics, astro]
  date: 2025-11-15
  excerpt: "From idea to shipped product in 2 weeks..."
```

**JSON Schema:** Added to `.vscode/settings.json` for auto-complete in VS Code.

**Component:** `LearningsTimeline.tsx` (React for interactivity)
- Timeline view with date headers
- Type badges: 📝 Blog (orange), 📰 Substack (purple), 📄 Doc (blue), 🎥 Video (red)
- Project filter pills at top (default: All)
- Numbered pagination (10 items/page)

**Reusable:** Same component on `/ab-simulator/` filtered to `project: ab-sim`.

### Contribute Page

**Route:** `/build-log/contribute/` (part of build-log sub-site)

**Content moved from Build Log:**
- Start Here Guide
- Open Tasks (TasksTable)
- Contributors (ContributorCards)
- How to Ship / FAQ

**Build Log keeps:**
- Hero
- Current Projects
- Learnings Timeline
- Small CTA: "Want to help? See open tasks →"

**Header nav update:**
```
About   Blog   Build Log   Contribute
```

---

## Backlog

- **PostHog Tracking** — CTA clicks, scroll depth (item 16, deferred)
