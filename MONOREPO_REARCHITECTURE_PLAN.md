# Monorepo Rearchitecture Plan

**Goal**: Isolate projects into workspaces, GitHub as source of truth, production-ready Build With Me platform

## Target Architecture

```
soma-portfolio/
├── packages/
│   ├── ab-simulator/          # Standalone Astro app
│   │   ├── package.json
│   │   ├── src/pages/index.astro
│   │   ├── public/js/*.js
│   │   └── README.md
│   ├── basketball-analyzer/   # Future project
│   └── shared/                # Shared utilities
│       ├── posthog.ts
│       ├── supabase.ts
│       └── analytics.ts
├── src/                       # Main portfolio site
│   ├── pages/
│   │   ├── index.astro        # Homepage
│   │   └── projects/
│   │       └── index.astro    # Build With Me hub
│   └── components/
├── scripts/
│   └── fetch-build-with-me-data.mjs
├── pnpm-workspace.yaml
└── package.json
```

**URL Structure**:
- `eeshans.com/` → Portfolio homepage
- `eeshans.com/projects/` → Build With Me hub
- `eeshans.com/ab-simulator/` → AB Sim app (from packages/ab-simulator)
- `eeshans.com/basketball/` → Basketball app (from packages/basketball-analyzer)

**GitHub Labels**:
- `project:ab-simulator`
- `project:basketball`
- `project:portfolio`

**Fetch script**: Filters issues by label, discovers projects dynamically

---

## Phase 1: Remove Mock Data ✅ **COMPLETE**

**Goal**: GitHub = source of truth, fail loudly on missing data

### - [x] 1.1: Fetch script fails without GITHUB_TOKEN
- `scripts/fetch-build-with-me-data.mjs` L21-24: Change `console.warn` + `exit(0)` → `console.error` + `exit(1)`

### - [x] 1.2: Remove hardcoded "upcoming" projects
- `scripts/fetch-build-with-me-data.mjs` L200-203: Delete `upcoming` array from payload
- `src/pages/projects/index.astro` L56-61: Remove `Upcoming` interface
- `src/pages/projects/index.astro` L66: Remove `upcoming` from destructuring
- `src/pages/projects/index.astro` L350-374: Delete Upcoming sidebar section

### - [x] 1.3: Add validation layer
- **New**: `src/lib/validate-build-with-me.ts` - Function checks arrays (cycles/tasks/hats/leaderboard), validates task fields (id/title/githubUrl/category), returns null on error
- `src/pages/projects/index.astro` L64: Import validator, call before destructuring, throw if null

### - [x] 1.4: Add pre-build hook
- `package.json`: Add `"prebuild": "node scripts/fetch-build-with-me-data.mjs"`

### - [x] 1.5: Update .env.example
- Add section for `GITHUB_TOKEN`, `GITHUB_REPO_OWNER`, `GITHUB_REPO_NAME`

### - [x] 1.6: Discover projects dynamically
- `scripts/fetch-build-with-me-data.mjs` L189: After building tasks, iterate to extract unique `projectSlug` values
- Build cycles by mapping slugs → filter tasks by slug → count open/claimed/merged
- Use `PROJECT_METADATA[slug]?.name ?? slug` for display names (prep for Phase 2)
- Remove any hardcoded project references (Basketball, Metal Lyrics)

### - [x] 1.7: Test Phase 1
```bash
npm run fetch:build-with-me  # Should output: Projects: ab-sim, Tasks: 1
cat src/data/build-with-me-data.json  # Verify no fake data
npm run build  # Should fail if data invalid
```

**Success Criteria**:
- ✅ Fetch fails without token
- ✅ No "upcoming" in JSON
- ✅ Build errors on bad data
- ✅ Only real GH issues shown
- ✅ Projects auto-discovered

---

## Phase 2: Monorepo Structure ✅ **COMPLETE**

**Trigger**: When 2+ distinct `project:*` labels exist on GitHub
**Goal**: Physical workspace separation

### - [x] 2.1: Install pnpm workspaces
```bash
npm i -g pnpm
echo 'packages:\n  - "packages/*"' > pnpm-workspace.yaml
rm -rf node_modules package-lock.json && pnpm install
```

### - [x] 2.2: Create shared package
- Created `packages/shared/` with placeholder utils for posthog, supabase, analytics

### - [x] 2.3: Create AB Simulator package
- Moved AB sim files to `packages/ab-simulator/src/pages/index.astro`
- Copied public assets (`public/js/ab-sim`, `puzzle-config.js`, `utils.js`)
- Created standalone BaseLayout.astro for AB sim
- Configured `base: '/ab-simulator'`, `outDir: '../../dist/ab-simulator'`
- Added `@soma/shared: workspace:*` dependency

### - [x] 2.4: Update root package.json
- Added `dev:ab-sim`, `build:packages`, updated `build` script

### - [x] 2.5: Update Dockerfile
- Installed pnpm globally, copied workspace files, used `pnpm install --frozen-lockfile`

### - [x] 2.6: Update nginx.conf
- Added `/ab-simulator/` location block with proper fallback

### - [x] 2.7: Centralize project metadata
- Added `PROJECT_METADATA` to both `.ts` and `.js` config files
- Exported `getProjectName()` and `getProjectPath()` helpers

### - [x] 2.8: Update fetch script
- Using `getProjectName(slug)` for dynamic project names

### - [x] 2.9: Test monorepo
- ✅ Build passes: `pnpm run build` successful
- ✅ `dist/ab-simulator/index.html` exists with all assets
- ✅ Root Astro config set to `emptyOutDir: false` to preserve package builds

### - [x] 2.10: Fix script loading and static assets
- ✅ Replaced dynamic script loading with static `<script src="">` tags (removed complexity)
- ✅ Removed `mode: 'cors'` from fetch calls (was breaking, not needed)
- ✅ Added `./public/**/*.js` to Tailwind content array (fixes purged classes)
- ✅ Centralized shared assets: `public/shared-assets/{fonts,favicon}`
- ✅ Created symlinks in package: `public/fonts` → `../../../public/shared-assets/fonts`
- ✅ Build completes with no errors, all assets copied correctly

**Success Criteria**:
- ✅ pnpm workspace functional with 3 packages (root, shared, ab-simulator)
- ✅ `dist/ab-simulator/index.html` exists with all JS, fonts, favicons
- ✅ Each package has isolated deps
- ✅ Metadata centralized with fallback for unknown projects
- ✅ JavaScript loads correctly (no dynamic loading complexity)
- ✅ Fonts/favicons shared via symlinks (zero duplication in git)
- ✅ Tailwind classes not purged from dynamically-generated HTML

---

## Phase 3: Build With Me Platform Overhaul 🎯 (8-12hr)

**Goal**: Transform static cards → professional dashboard with shadcn/ui DataTables

**Problems**: Hardcoded stats, no data tables, basic filters, no search, no freshness indicators
**Solution**: Dynamic stats, shadcn DataTable, fuzzy search, multi-select filters, sync status

### Tasks:

- [ ] **3.1: Remove hardcoding** - Compute "Current Cycle" stats from actual data, add `startDate` to cycles
- [ ] **3.2: Install shadcn/ui** - `pnpm dlx shadcn@latest init` + add table, command, tabs, badge, select, avatar components
- [ ] **3.3: TasksTable** - DataTable with columns (title, project, categories, points, status, assignee), sortable, filterable
- [ ] **3.4: LeaderboardTable** - Add avatars, rank medals (🥇🥈🥉), expandable rows, fetch `avatar_url` from GitHub
- [ ] **3.5: Search** - fuse.js fuzzy search, Cmd+K shortcut, live results (< 200ms)
- [ ] **3.6: Advanced filters** - Multi-select dropdowns, quick filters ("Easy Wins", "High Impact"), URL persistence
- [ ] **3.7: Freshness UI** - Last sync indicator (🟢🟡🔴), manual refresh button, add `lastFetchTime` to JSON
- [ ] **3.8: Mobile optimization** - Cards on mobile, tables on desktop, responsive breakpoints

**Components**:
```
src/components/build-with-me/
├── TasksTable.tsx / TaskCards.tsx
├── LeaderboardTable.tsx / HatsTable.tsx
├── SearchBar.tsx / FilterPanel.tsx
├── DataFreshness.tsx / CycleCard.tsx
└── types.ts
```

**Success Criteria**: Zero hardcoded values, DataTables with sort/filter/search, contributor avatars, mobile responsive, data freshness visible, filters in URL, page < 200 lines

---

## Deployment

**Status**: ✅ Phases 1 & 2 complete and deployed

**Production URLs**:
- `eeshans.com/` → Portfolio
- `eeshans.com/projects/` → Build With Me
- `eeshans.com/ab-simulator/` → AB Simulator

**Deploy**: `fly deploy`

---

## Implementation Notes

**Shared Assets** (symlinks):
- `public/shared-assets/{fonts,favicon}` → All packages symlink to this
- 50% size reduction (640KB → 320KB)
- Git commits symlinks, build dereferences to real files

**Environment Variables**:
- `packages/*/.env` → Symlinked to root `.env`
- All `PUBLIC_*` vars accessible via `import.meta.env`

**Lessons**:
- ✅ Fix root causes (Tailwind content array), not symptoms (CSS hacks)
- ✅ Simplify (static script tags), don't add complexity (dynamic loading)
- ❌ Avoid: Dynamic loading, explicit CORS mode, asset duplication
