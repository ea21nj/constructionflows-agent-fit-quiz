# Arcade Strategy Quiz — Design Spec
**Date:** 2026-06-12  
**File to create:** `arcade.html` (project root, alongside `index.html`)

---

## Overview

A fully self-contained single HTML file (`arcade.html`) that wraps the existing Construct Flows operational maturity quiz in an RTS / Command & Conquer strategy game interface. The home screen is a "Workflow Territory Map" where each of the 9 quiz sections is an "operation" to capture. Users complete each operation's 3 questions, return to the map, then pick another. After all 9 operations are complete, a Mission Debrief shows the full maturity profile.

This file shares no code with `index.html` — it embeds the same question/category/profile data directly and handles all state internally.

---

## Screen Flow

```
Home (Territory Map)
  → [click operation tile] → Stage Quiz (3 questions)
    → [submit last answer] → Stage Complete ("Territory Secured")
      → [Return to Map] → Home (Territory Map, tile now captured)
        → [all 9 complete] → Mission Debrief
          → [Replay] → Home (reset)
          → [Download Report] → HTML file download
```

---

## Persistent RTS HUD

The RTS chrome is always visible across all 4 screens. It has 3 zones:

### Top Resource Bar
`height: 36px | background: #060a10 | border-bottom: 1px solid #1a2535`

Left to right:
- **CF SYS** brand label
- **Visibility** resource (blue dot `#4cc9f0`, counter)
- **Ops** resource (pink dot `#f72585`, counter)
- **Score** resource (gold dot `#ffd700`, counter)
- **Clock** (MM:SS, counting up from 00:00 on page load)

Resource counters tick up when an answer is selected. They are cosmetic multipliers of the underlying category scores — Score = total raw points × 75, Visibility = visibility-category earned points × 30, Ops = ops-category earned points × 30.

### Right Sidebar
`width: 72px | background: #060a10 | border-left: 1px solid #1a2535`

Eight mini stat bars, one per maturity category:
- Visibility, Standardization, Accountability, Forecast, Ops, Knowledge, Scalability, Customer
- Each: label (6px mono, uppercase), 3px bar with category color, numeric % value
- Updates live as each question is answered
- Shows `—` until that category has any answered questions

Category colors: Visibility `#4cc9f0`, Standardization `#f72585`, Accountability `#7bed9f`, Forecast `#ffd700`, Ops `#ff9f43`, Knowledge `#a29bfe`, Scalability `#fd79a8`, Customer `#55efc4`

### Bottom Command Panel
`height: 38px | background: #060a10 | border-top: 1px solid #1a2535`

Context-sensitive per screen:
- **Home:** `▶ Enter [Op-Name]` (primary) | `Debrief` (disabled until all 9 complete) | status text showing selected operation
- **Stage Quiz:** `◀ Abort` | `Next ▶` (primary, disabled until answered) | status showing selected option + Enter hint
- **Stage Complete:** `◀ Return to Map` (primary) | `View Intel` (no-op / decorative) | "N Operations Remaining"
- **Debrief:** `↓ Download Report` (primary) | `Replay` | "Mission Complete — 9/9"

---

## Screen 1: Home / Territory Map

**Background:** Dark navy radial gradient + subtle grid lines (repeating-linear-gradient, 28px pitch, 3% opacity)

**Content:**
- Map header row: `// Workflow Territory Map` label (mono, blue-tinted) + blinking `▶ Select Target`
- 3×3 grid of 9 operation tiles

**Operation Tile States:**
| State | Border | Background | Left strip | Pip dots |
|-------|--------|------------|------------|----------|
| Available | `rgba(60,100,140,0.25)` | `rgba(20,35,60,0.5)` | none | empty |
| Active (selected) | `rgba(100,150,255,0.6)` animated pulse | `rgba(20,40,100,0.5)` | `rgba(100,150,255,0.8)` | first pip blinking |
| Captured (complete) | `rgba(100,220,160,0.35)` | `rgba(10,50,30,0.5)` | `rgba(100,220,160,0.8)` | all pips filled green |
| Fog (not yet visited, ops 7–8 only) | — | — | — | no pips shown, opacity 0.22 |

Fog clears as soon as any stage has been completed (purely cosmetic — all stages are playable from the start).

Each tile shows: Op number (`Op-01`), section name, score % (if captured), 3 pip dots.

Single click on a tile immediately enters that stage — no two-step selection. The command panel "Enter" button is also clickable and has the same effect as clicking the tile. Completed stages show their score and can be replayed (answers reset for that stage only).

---

## Screen 2: In-Stage Quiz

The center panel replaces with the question UI. The resource bar, sidebar, and command bar remain.

**Center layout:**
- Stage header: left-bordered tag with stage label + stage name (Bebas Neue 18px) | right: "Question 01 / 03" + live score counter
- 2px progress strip (fills 33% → 66% → 100% as questions advance)
- "Why this matters" hint (7px mono, gold-tinted)
- Question text (Bebas Neue 22px, light blue-white)
- Options list (4 items for multiple-choice, textarea for text questions)

**Option item states:**
- Default: dark navy background, `rgba(60,100,140,0.3)` border, muted text
- Hover: subtle blue glow background (CSS `::before` width 100%)
- Selected: `rgba(10,50,30,0.5)` background, green border `rgba(100,220,160,0.5)`, green letter, brighter text

**Text questions (Q25, Q26 in Stage 8 — Automation Readiness):**
- Rendered as `<textarea>` styled as a terminal input: `background: rgba(8,16,28,0.8)`, green-tinted border, `IBM Plex Mono` font, placeholder in muted mono
- Label: `// Intel Input` above the textarea
- Command bar "Next ▶" becomes "Submit Intel ▶"
- Requires at least 1 character to enable submission

**Q22 (Customer Experience — "Where do customers experience the most confusion"):**
- Has 5 options all worth 0 score
- Rendered as normal multiple-choice options
- Answer captured and shown in Mission Debrief; does not affect scoring

**Enter key:** If an answer is selected and focus is anywhere inside the quiz (not on Abort button), Enter advances to the next question or submits the stage.

---

## Screen 3: Stage Complete

Triggered after the 3rd question is submitted within a stage.

**Center layout (centered column):**
- Kicker: `// Operation Complete`
- Title: `TERRITORY SECURED` (Bebas Neue 36px, green glow `rgba(100,220,160,0.9)`)
- Subtitle: operation number + section name
- Score box: large % score for the stage (category-weighted maturity)
- XP line: "+ [N] Score Points Earned" (gold)
- Two progress bars: stage maturity %, overall progress (stages completed / 9)

**Stage score calculation:** Same formula as index.html for the questions in that stage — `earned / possible × 100`.

---

## Screen 4: Mission Debrief

Triggered when all 9 stages have been completed (all 27 questions submitted).

**Center layout:**
- Kicker: `// Mission Complete — All 9 Territories Secured`
- Profile name (Bebas Neue 30px, white)
- Overall maturity score (gold, mono)
- Profile summary text (small, muted)
- 2×2 card grid: worst 2 categories (red-tinted, "Priority Gap") + best 2 categories (green-tinted, "Strength"), each with name, %, and a 2px bar
- Priority fixes: 3 numbered items from `profile.priority` array

**Report download:** Calls the same `buildReportHtml()` / blob download pattern as `index.html`. Report content is identical — full 27 answers, all category scores, profile, date.

---

## Data & State

Reuses `questions`, `categories`, and `profiles` arrays verbatim from `index.html` (embedded directly in `arcade.html`).

**State variables:**
```js
let answers = Array(27).fill(null);       // selected option index per question
let textAnswers = Array(27).fill('');     // open-text responses
let completedStages = new Set();          // stage indices 0–8 that are done
let stageScorePct = {};                   // { stageIndex: score% }
let currentStage = null;                  // null = on home screen
let currentQuestionInStage = 0;           // 0, 1, or 2
let clockSeconds = 0;                     // ticks every second
```

**Stage-to-question mapping:**
```
Stage 0 → Q[0,1,2]    Lead Source Intelligence
Stage 1 → Q[3,4,5]    Estimating / Proposal Workflow
Stage 2 → Q[6,7,8]    Accountability & Ownership
Stage 3 → Q[9,10,11]  Forecasting & Revenue Visibility
Stage 4 → Q[12,13,14] Communication & Decision Tracking
Stage 5 → Q[15,16,17] Operational Readiness Before Close
Stage 6 → Q[18,19,20] Process Variability
Stage 7 → Q[21,22,23] Customer Experience Friction
Stage 8 → Q[24,25,26] Automation Readiness
```

---

## Fonts & Colors

**Fonts:** Google Fonts — Bebas Neue, IBM Plex Mono (400/500/600), Inter (400/500/600)

**Core palette:**
| Token | Value | Use |
|-------|-------|-----|
| `--bg` | `#060a12` | base background |
| `--grid` | `rgba(100,150,255,0.03)` | background grid lines |
| `--border` | `#1a2535` | all structural borders |
| `--panel` | `#060a10` | topbar, sidebar, cmdbar |
| `--blue` | `rgba(100,150,255,*)` | primary accent (selections, progress, active) |
| `--green` | `rgba(100,220,160,*)` | captured / complete / selected answer |
| `--gold` | `#ffd700` | score, XP, resource counter |
| `--text-dim` | `rgba(180,200,230,0.55)` | option text default |
| `--text-on` | `rgba(180,230,200,0.85)` | option text selected |

---

## Animations

- **Territory active pulse:** CSS `@keyframes` alternating border opacity/box-shadow, 2.5s infinite
- **Blinking text:** CSS `@keyframes blink` step-end 50% opacity, used on "Select Target" and Enter hints
- **Resource counter tick:** On answer selection, `setInterval` runs 20 frames ticking the displayed counter toward its new value, then clears
- **Progress strip:** CSS `transition: width 0.4s ease`
- **Stage complete flash:** Brief `box-shadow` glow on "TERRITORY SECURED" text — CSS `@keyframes` 0.6s, triggered by adding a class

---

## File Structure

Single file `arcade.html`:
1. `<head>`: meta, fonts, all CSS in `<style>`
2. `<body>`: 4 screen `<div>`s (home, stage, complete, debrief) — only one visible at a time via `display:none/flex`
3. `<script>`: data arrays, state variables, render functions, event handlers

No build step. No external JS. No Vite config changes needed — `vite.config.js` already handles `*.html` files.

---

## Out of Scope

- Sound effects
- Backend/API submission
- Animations between screen transitions (fade/slide) — screens switch instantly
- Mobile layout (same as `index.html` — not optimized for mobile)
- Saving progress between sessions (no localStorage persistence)
