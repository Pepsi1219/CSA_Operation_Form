# CSA Operation Sign-Off Report

Web-based training tracking form for garment sewing operations (30-day/hour training log per worker). Vanilla HTML/CSS/JS, no build step — open `index.html` directly.

## Files
- **index.html** — markup: form header, 30-row table, chart modal, quick-entry modal, action-plan/signature modals
- **script.js** — all logic: i18n, calculations, chart, persistence, modals
- **style.css** — theme (light/dark via `[data-theme="dark"]` on `<html>`), form layout, modals

## External deps (CDN, SRI-pinned)
- `xlsx-js-style@1.2.0` — Excel export
- `chart.js@4.4.6` + `chartjs-plugin-datalabels@2.2.0` — chart with per-point labels
- `katex@0.16.11` — math formula rendering in curve-model hints
- FontAwesome 6.4.0 icons

## Core features

### Training log table (30 rows)
Each row: day/hour number, target eff (%), target Q'ty (pcs/hr), avg time (sec/min), actual eff, actual pcs, pass, fail, quality rate, 4M cause checkboxes, action plan textarea, signature.

- **Day/Hour column** auto-numbers starting from the row AFTER `firstDayQ100` (first row with 100% quality)
- **Row delete button** (trash icon under day number) clears one row's data
- **Quality rate** only calculates when BOTH pass AND fail are entered

### Learning curve planning
4 curve models selectable via `curveModel` dropdown (empty by default — trainer must pick):
- **Linear**: `progress = x/N`
- **Logarithmic**: `progress = ln(x+1)/ln(N+1)` (shifted form of `Y = a + b·ln(x)`)
- **Power** (Wright's Law, b=0.5): `progress = √(x/N)`
- **S-Curve** (smoothstep): `progress = 3t² − 2t³`

Where `x = deltaDay`, `N = remainingDays`. Applied as `Y = anchor + (target − anchor) × progress`.

**Two planning modes:**
- **Adaptive** (default): anchor = last actual day/eff → plan re-projects forward every time actual is entered
- **Fixed** (toggle): anchor = firstDayQ100 + eff on that day → plan locked from Q100 onward, doesn't adapt

**Rule enforced**: `d <= anchorDay` targets are never modified (past + current day are locked).

### Chart modal (`#chartModal`)
- Line chart, target (blue) vs actual (green)
- **Live parameter editing**: Target Eff, Training Duration (days/hours), SAM (min/sec) — edit in chart, syncs back to form
- **X-axis click** on Day label → opens `quickEntryModal` for that day (avg sec + pass + fail)
- **Toggle buttons** (top row): Adaptive/Fixed plan, Show as %/pcs, Show/Hide % labels
- **Data labels**: pill-style badges (colored border, opaque bg) above target / below actual points; auto-flip if actual > target on the same day to avoid overlap
- **Y-axis**: `grace: '8%'` for both modes — auto-scales beautifully whether Target Eff is 75%, 500%, or in pcs

### i18n
4 languages (`th` default, `en`, `vn`, `lo`). Translations live in `translations` object in script.js (line ~10). `t(key, ...args)` helper reads current lang; function-valued entries support runtime args like `chartXDay: (d) => \`วันที่ ${d}\``. Elements marked via `data-i18n`, `data-i18n-title`, `data-i18n-placeholder`, `data-i18n-html`.

### LocalStorage (auto-save)
- Key: `csaOperationForm.v1`
- Saves: header inputs, row raw inputs (avg sec, pass, fail), textareas, signatures (data URLs), checkboxes, `flags.fixedPlanMode`
- Debounced 400ms on any `input`/`change` event
- Restored on `DOMContentLoaded` (before `calculateAdaptiveGoals` so derived cells recompute correctly)
- **Skipped during restore** via `_isRestoring` flag to prevent save-loops
- **Clear button** (trash in header) also wipes localStorage — no ghost data on reload

### Signature pad
Per-row `<canvas>`-driven pad in `signModal`. Rendered signature stored as data URL on the row's `<img id="signImg_${d}">`. Restored from localStorage.

### Excel export
`XLSX.utils.book_new()` with custom cell styles. Header block + 30-row table exported to `.xlsx` — filename includes employee name + date.

## Modal z-index stack
- `.modal` (chartModal, quickEntryModal, manualInputModal, signModal, actionPlanModal): **1001**
- `.modal-overlay` (notificationModal / confirm dialog): **1100** — MUST be highest so confirm dialogs opened from within other modals appear on top

## ESC key handling
Priority order (closes topmost first, `return` after each so only one modal closes per keypress):
1. notificationModal
2. signModal
3. manualInputModal
4. actionPlanModal
5. quickEntryModal
6. chartModal

## Naming conventions
- Row-scoped IDs use suffix `_${d}` where `d` is 1..30 (raw row index, NOT training day number)
- `targetDay` (hidden input) tracks the row that "Save" writes to; auto-advances via `updateAutoTargetDay()` based on `resAvgSec_${d}` populated cells
- Toggle-state module-level vars use `_camelCase` prefix (e.g. `_chartUnit`, `_fixedPlanMode`, `_chartLabelsVisible`)

## Gotchas
- `type="number"` inputs sanitize invalid intermediate values (e.g. `"0."`) — sync handlers must NOT overwrite the input the user is currently editing. `showPerformanceChart(true)` skips param-sync for this reason.
- Chart.js v4 does NOT auto-register `chartjs-plugin-datalabels` — must call `Chart.register(ChartDataLabels)` manually (done once, guarded by `Chart._dataLabelsRegistered`).
- `.modal-content input` was originally styled for `manualInputModal` (big monospace) — now scoped to `#manualInputModal .modal-content input` to avoid leaking into chart-param inputs.
- Form header uses `position: relative; z-index: 200` so curve-hint floating tooltip doesn't get hidden behind sticky `.stopwatch-bar` (z-index: 100).
