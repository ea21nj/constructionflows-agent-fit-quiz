# Arcade Strategy Quiz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `arcade.html` — a fully self-contained RTS/strategy-game-skinned version of the Construct Flows operational maturity quiz, where 9 quiz sections are "operations" on a territory map.

**Architecture:** Single HTML file with all CSS in `<style>` and all JS in `<script>`. Four screens (home, stage, complete, debrief) share a persistent RTS HUD (resource bar, sidebar, command panel) and swap only the center content. All question/category/profile data is embedded directly — no imports, no build step required.

**Tech Stack:** Vanilla HTML/CSS/JS. Google Fonts (Bebas Neue, IBM Plex Mono, Inter). Vite dev server for local preview only (`npm run start` → `http://localhost:5173/arcade.html`).

**Spec:** `docs/superpowers/specs/2026-06-12-arcade-strategy-quiz-design.md`

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `arcade.html` | **Create** | Entire application — HTML, CSS, JS |
| `vite.config.js` | No change | Dev server already serves all root HTML files |
| `.gitignore` | **Modify** | Add `.superpowers/` |

---

## Task 1: HTML/CSS Scaffold

**Files:**
- Create: `arcade.html`

The full CSS foundation — RTS chrome, screen layout, all component styles. After this task the page renders the static HUD shell with placeholder center content.

- [ ] **Step 1: Create arcade.html with full HTML + CSS**

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Construct Flows — Workflow Operations</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    /* ── RESET + ROOT ─────────────────────────── */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { height: 100%; overflow: hidden; }
    body {
      font-family: 'Inter', sans-serif;
      background: #060a12;
      color: #fff;
      display: flex;
      flex-direction: column;
    }

    /* ── TOP RESOURCE BAR ─────────────────────── */
    #rts-topbar {
      flex-shrink: 0;
      height: 36px;
      background: #060a10;
      border-bottom: 1px solid #1a2535;
      display: flex;
      align-items: center;
      padding: 0 12px;
      gap: 0;
      z-index: 10;
    }
    .rts-brand {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 8px;
      letter-spacing: 3px;
      color: rgba(100,150,255,0.45);
      text-transform: uppercase;
      padding-right: 12px;
      border-right: 1px solid #1a2535;
      margin-right: 0;
    }
    .rts-resource {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 0 12px;
      border-right: 1px solid #1a2535;
    }
    .rts-res-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .rts-res-val {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 1px;
      min-width: 36px;
    }
    .rts-res-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 7px;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #3a4a5a;
    }
    #rts-clock {
      margin-left: auto;
      font-family: 'IBM Plex Mono', monospace;
      font-size: 10px;
      letter-spacing: 3px;
      color: rgba(100,150,255,0.3);
    }

    /* ── BODY: CENTER + SIDEBAR ───────────────── */
    #rts-body {
      flex: 1;
      display: flex;
      overflow: hidden;
    }
    #rts-center {
      flex: 1;
      overflow: hidden;
      position: relative;
    }

    /* ── SCREENS ──────────────────────────────── */
    .screen {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
    }
    .screen.hidden { display: none; }

    /* shared background grid */
    .screen-grid-bg {
      position: absolute;
      inset: 0;
      background:
        repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(100,150,255,0.025) 28px, rgba(100,150,255,0.025) 29px),
        repeating-linear-gradient(90deg, transparent, transparent 28px, rgba(100,150,255,0.025) 28px, rgba(100,150,255,0.025) 29px);
      pointer-events: none;
    }

    /* ── SIDEBAR ──────────────────────────────── */
    #rts-sidebar {
      width: 72px;
      background: #060a10;
      border-left: 1px solid #1a2535;
      padding: 8px 6px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      overflow: hidden;
      flex-shrink: 0;
    }
    .sidebar-title {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 6px;
      letter-spacing: 2px;
      color: rgba(100,150,255,0.3);
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    .sidebar-stat { }
    .sidebar-stat-name {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 5.5px;
      letter-spacing: 1px;
      color: #3a4a5a;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    .sidebar-bar {
      height: 3px;
      background: #0d1520;
      border: 1px solid #1a2535;
      overflow: hidden;
    }
    .sidebar-bar-fill { height: 100%; width: 0%; transition: width 0.4s ease; }
    .sidebar-val {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 5.5px;
      color: #3a4a5a;
      margin-top: 1px;
    }
    .sidebar-divider { height: 1px; background: #1a2535; margin: 2px 0; }

    /* ── BOTTOM COMMAND BAR ───────────────────── */
    #rts-cmdbar {
      flex-shrink: 0;
      height: 38px;
      background: #060a10;
      border-top: 1px solid #1a2535;
      display: flex;
      align-items: center;
      padding: 0 12px;
      gap: 8px;
      z-index: 10;
    }
    .cmd-btn {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 8px;
      letter-spacing: 2px;
      text-transform: uppercase;
      border: 1px solid #1a2535;
      background: rgba(100,150,255,0.04);
      color: rgba(100,150,255,0.3);
      padding: 5px 12px;
      cursor: pointer;
      transition: border-color 0.12s, color 0.12s, box-shadow 0.12s;
      white-space: nowrap;
    }
    .cmd-btn:hover:not(:disabled) { border-color: rgba(100,150,255,0.35); color: rgba(100,150,255,0.7); }
    .cmd-btn.primary {
      border-color: rgba(100,150,255,0.5);
      color: rgba(100,150,255,0.9);
      box-shadow: 0 0 8px rgba(100,150,255,0.12), inset 0 0 8px rgba(100,150,255,0.04);
    }
    .cmd-btn:disabled { opacity: 0.25; cursor: not-allowed; }
    #cmd-status {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 7px;
      letter-spacing: 2px;
      color: #3a4a5a;
      text-transform: uppercase;
      margin-left: auto;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #cmd-status span { color: rgba(100,150,255,0.5); }

    /* ── HOME SCREEN ──────────────────────────── */
    #screen-home {
      background: radial-gradient(ellipse at 50% 30%, rgba(40,60,120,0.15) 0%, transparent 60%),
                  linear-gradient(180deg, #0a0e18 0%, #060a12 100%);
      padding: 14px;
      gap: 10px;
    }
    .map-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 1;
    }
    .map-title {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 7px;
      letter-spacing: 3px;
      color: rgba(100,150,255,0.4);
      text-transform: uppercase;
    }
    .map-blink {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 7px;
      letter-spacing: 2px;
      color: rgba(100,150,255,0.25);
      animation: blink 1.4s step-end infinite;
    }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

    .territory-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 5px;
      position: relative;
      z-index: 1;
      flex: 1;
    }
    .territory {
      background: rgba(20,35,60,0.5);
      border: 1px solid rgba(60,100,140,0.25);
      padding: 10px 9px;
      cursor: pointer;
      position: relative;
      transition: border-color 0.15s, background 0.15s;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .territory::before {
      content: '';
      position: absolute;
      left: 0; top: 0;
      width: 2px; height: 100%;
      background: transparent;
      transition: background 0.15s;
    }
    .territory:hover { border-color: rgba(100,150,255,0.4); background: rgba(30,50,100,0.35); }
    .territory.captured { border-color: rgba(100,220,160,0.35); background: rgba(10,50,30,0.5); }
    .territory.captured::before { background: rgba(100,220,160,0.8); }
    .territory.fog { opacity: 0.22; pointer-events: none; }
    @keyframes t-pulse {
      0%,100% { border-color: rgba(100,150,255,0.4); box-shadow: none; }
      50% { border-color: rgba(100,150,255,0.8); box-shadow: 0 0 12px rgba(100,150,255,0.15); }
    }
    .t-num {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 6px;
      letter-spacing: 2px;
      color: rgba(100,150,255,0.35);
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .territory.captured .t-num { color: rgba(100,220,160,0.5); }
    .t-name {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 11px;
      letter-spacing: 1px;
      color: rgba(180,200,230,0.8);
      line-height: 1.1;
      flex: 1;
    }
    .territory.captured .t-name { color: rgba(100,220,160,0.9); }
    .t-score {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 7px;
      letter-spacing: 1px;
      color: rgba(100,220,160,0.7);
      margin-top: 4px;
    }
    .t-pips { display: flex; gap: 3px; margin-top: 5px; }
    .pip { width: 5px; height: 5px; border: 1px solid rgba(100,150,255,0.2); background: transparent; }
    .pip.done { background: rgba(100,220,160,0.7); border-color: rgba(100,220,160,0.5); }
    .pip.active { background: rgba(100,150,255,0.7); border-color: rgba(100,150,255,0.8); animation: blink 1s step-end infinite; }

    /* ── STAGE SCREEN ─────────────────────────── */
    #screen-stage {
      background: radial-gradient(ellipse at 50% 80%, rgba(40,60,120,0.12) 0%, transparent 60%),
                  linear-gradient(180deg, #08101a 0%, #060a12 100%);
      padding: 14px;
      gap: 0;
    }
    .stage-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
      position: relative;
      z-index: 1;
    }
    .stage-tag {
      border-left: 2px solid rgba(100,150,255,0.7);
      padding-left: 8px;
    }
    .stage-tag-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 6px;
      letter-spacing: 3px;
      color: rgba(100,150,255,0.5);
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .stage-tag-name {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 18px;
      letter-spacing: 2px;
      color: #fff;
      line-height: 1;
    }
    .stage-meta { text-align: right; }
    .stage-q-of {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 7px;
      letter-spacing: 2px;
      color: rgba(100,150,255,0.4);
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .stage-score-live {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 14px;
      font-weight: 600;
      letter-spacing: 2px;
      color: #ffd700;
      text-shadow: 0 0 6px rgba(255,215,0,0.35);
    }
    .stage-progress {
      height: 2px;
      background: rgba(100,150,255,0.1);
      margin-bottom: 14px;
      position: relative;
      z-index: 1;
    }
    .stage-progress-fill {
      height: 100%;
      width: 0%;
      background: rgba(100,150,255,0.7);
      box-shadow: 0 0 6px rgba(100,150,255,0.4);
      transition: width 0.4s ease;
    }
    .q-why {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 7px;
      letter-spacing: 1px;
      color: rgba(255,215,0,0.4);
      line-height: 1.5;
      margin-bottom: 8px;
      position: relative;
      z-index: 1;
    }
    .q-text {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 24px;
      letter-spacing: 1px;
      line-height: 1.0;
      color: #e8eef8;
      margin-bottom: 14px;
      position: relative;
      z-index: 1;
    }
    .q-options {
      display: flex;
      flex-direction: column;
      gap: 4px;
      position: relative;
      z-index: 1;
      flex: 1;
    }
    .q-option {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px;
      border: 1px solid rgba(60,100,140,0.3);
      background: rgba(15,25,45,0.6);
      cursor: pointer;
      transition: border-color 0.12s, background 0.12s;
      position: relative;
      overflow: hidden;
      user-select: none;
    }
    .q-option::before {
      content: '';
      position: absolute;
      left: 0; top: 0;
      width: 0; height: 100%;
      background: rgba(100,150,255,0.07);
      transition: width 0.15s;
    }
    .q-option:hover::before { width: 100%; }
    .q-option:hover { border-color: rgba(100,150,255,0.4); }
    .q-option.selected { border-color: rgba(100,220,160,0.5); background: rgba(10,50,30,0.5); }
    .q-option.selected::before { width: 100%; background: rgba(100,220,160,0.06); }
    .q-letter {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9px;
      font-weight: 600;
      letter-spacing: 1px;
      color: rgba(100,150,255,0.4);
      width: 16px;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }
    .q-option.selected .q-letter { color: rgba(100,220,160,0.8); }
    .q-opt-text {
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      color: rgba(180,200,230,0.55);
      line-height: 1.4;
      position: relative;
      z-index: 1;
    }
    .q-option.selected .q-opt-text { color: rgba(180,230,200,0.85); }

    /* text question */
    .q-intel-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 7px;
      letter-spacing: 3px;
      color: rgba(100,150,255,0.35);
      text-transform: uppercase;
      margin-bottom: 6px;
      position: relative;
      z-index: 1;
    }
    .q-textarea {
      width: 100%;
      flex: 1;
      min-height: 100px;
      background: rgba(8,16,28,0.85);
      border: 1px solid rgba(100,150,255,0.2);
      color: rgba(180,210,255,0.8);
      font-family: 'IBM Plex Mono', monospace;
      font-size: 12px;
      line-height: 1.6;
      padding: 10px 12px;
      resize: none;
      outline: none;
      position: relative;
      z-index: 1;
      transition: border-color 0.12s;
    }
    .q-textarea:focus { border-color: rgba(100,150,255,0.5); }
    .q-textarea::placeholder { color: rgba(100,150,255,0.2); }

    /* ── STAGE COMPLETE SCREEN ────────────────── */
    #screen-complete {
      background: #040810;
      align-items: center;
      justify-content: center;
      gap: 0;
    }
    #screen-complete::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 50% 40%, rgba(100,220,160,0.07) 0%, transparent 60%);
      pointer-events: none;
    }
    .cc-kicker {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 7px;
      letter-spacing: 4px;
      color: rgba(100,220,160,0.5);
      text-transform: uppercase;
      margin-bottom: 8px;
      position: relative;
      z-index: 1;
    }
    .cc-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 40px;
      letter-spacing: 4px;
      color: rgba(100,220,160,0.9);
      text-shadow: 0 0 30px rgba(100,220,160,0.25);
      text-align: center;
      line-height: 1;
      margin-bottom: 4px;
      position: relative;
      z-index: 1;
    }
    .cc-subtitle {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 14px;
      letter-spacing: 3px;
      color: rgba(180,200,230,0.45);
      margin-bottom: 22px;
      position: relative;
      z-index: 1;
    }
    .cc-score-box {
      border: 1px solid rgba(100,220,160,0.2);
      background: rgba(10,50,30,0.4);
      padding: 14px 28px;
      text-align: center;
      margin-bottom: 14px;
      position: relative;
      z-index: 1;
    }
    .cc-score-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 7px;
      letter-spacing: 3px;
      color: rgba(100,220,160,0.4);
      text-transform: uppercase;
      margin-bottom: 6px;
    }
    .cc-score-val {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 52px;
      color: rgba(100,220,160,0.9);
      line-height: 1;
    }
    .cc-score-pct {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 9px;
      color: rgba(100,220,160,0.45);
      letter-spacing: 2px;
    }
    .cc-xp {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 11px;
      letter-spacing: 2px;
      color: #ffd700;
      text-shadow: 0 0 8px rgba(255,215,0,0.35);
      margin-bottom: 20px;
      position: relative;
      z-index: 1;
    }
    .cc-bar-wrap {
      width: 220px;
      margin-bottom: 10px;
      position: relative;
      z-index: 1;
    }
    .cc-bar-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 6px;
      letter-spacing: 2px;
      color: rgba(100,220,160,0.35);
      text-transform: uppercase;
      margin-bottom: 4px;
      display: flex;
      justify-content: space-between;
    }
    .cc-bar { height: 3px; background: rgba(100,220,160,0.1); border: 1px solid rgba(100,220,160,0.15); }
    .cc-bar-fill { height: 100%; background: rgba(100,220,160,0.7); box-shadow: 0 0 6px rgba(100,220,160,0.3); transition: width 0.6s ease; }

    /* ── DEBRIEF SCREEN ───────────────────────── */
    #screen-debrief {
      background: linear-gradient(180deg, #060c16 0%, #04080e 100%);
      padding: 16px;
      gap: 8px;
    }
    #screen-debrief::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 50% 0%, rgba(100,150,255,0.08) 0%, transparent 50%);
      pointer-events: none;
    }
    .db-kicker {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 7px;
      letter-spacing: 4px;
      color: rgba(100,150,255,0.4);
      text-transform: uppercase;
      position: relative;
      z-index: 1;
    }
    .db-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 32px;
      letter-spacing: 2px;
      color: #fff;
      line-height: 1;
      margin-bottom: 2px;
      position: relative;
      z-index: 1;
    }
    .db-profile-score {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 8px;
      letter-spacing: 2px;
      color: #ffd700;
      text-shadow: 0 0 6px rgba(255,215,0,0.3);
      position: relative;
      z-index: 1;
      margin-bottom: 4px;
    }
    .db-summary {
      font-size: 11px;
      color: rgba(180,200,230,0.4);
      line-height: 1.5;
      position: relative;
      z-index: 1;
      max-width: 480px;
      margin-bottom: 4px;
    }
    .db-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px;
      position: relative;
      z-index: 1;
      flex: 1;
    }
    .db-card {
      background: rgba(15,25,45,0.6);
      border: 1px solid rgba(60,100,140,0.25);
      padding: 10px 11px;
    }
    .db-card.gap { border-color: rgba(247,37,133,0.25); }
    .db-card.strength { border-color: rgba(100,220,160,0.25); }
    .db-card-label {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 6px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: rgba(100,150,255,0.4);
      margin-bottom: 4px;
    }
    .db-card.gap .db-card-label { color: rgba(247,37,133,0.5); }
    .db-card.strength .db-card-label { color: rgba(100,220,160,0.5); }
    .db-card-name {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 14px;
      letter-spacing: 1px;
      color: rgba(180,200,230,0.8);
      margin-bottom: 2px;
    }
    .db-card-score {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 7px;
      letter-spacing: 1px;
      color: rgba(180,200,230,0.35);
    }
    .db-card.gap .db-card-score { color: rgba(247,37,133,0.5); }
    .db-card.strength .db-card-score { color: rgba(100,220,160,0.6); }
    .db-bar { height: 2px; background: rgba(100,150,255,0.1); margin-top: 6px; }
    .db-bar-fill { height: 100%; background: rgba(100,150,255,0.5); }
    .db-card.gap .db-bar-fill { background: rgba(247,37,133,0.5); }
    .db-card.strength .db-bar-fill { background: rgba(100,220,160,0.5); }
    .db-fixes {
      position: relative;
      z-index: 1;
    }
    .db-fixes-title {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 6px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: rgba(100,150,255,0.35);
      margin-bottom: 5px;
    }
    .db-fix {
      font-family: 'IBM Plex Mono', monospace;
      font-size: 8px;
      color: rgba(180,200,230,0.45);
      letter-spacing: 1px;
      line-height: 1.6;
    }
    .db-fix span { color: rgba(100,150,255,0.5); margin-right: 6px; }
  </style>
</head>
<body>

  <!-- TOP RESOURCE BAR -->
  <div id="rts-topbar">
    <span class="rts-brand">CF SYS</span>
    <div class="rts-resource">
      <div class="rts-res-dot" style="background:#4cc9f0;box-shadow:0 0 4px #4cc9f0"></div>
      <span class="rts-res-val" id="res-vis" style="color:#4cc9f0">0</span>
      <span class="rts-res-label">Vis</span>
    </div>
    <div class="rts-resource">
      <div class="rts-res-dot" style="background:#f72585;box-shadow:0 0 4px #f72585"></div>
      <span class="rts-res-val" id="res-ops" style="color:#f72585">0</span>
      <span class="rts-res-label">Ops</span>
    </div>
    <div class="rts-resource" style="border-right:none;">
      <div class="rts-res-dot" style="background:#ffd700;box-shadow:0 0 4px #ffd700"></div>
      <span class="rts-res-val" id="res-score" style="color:#ffd700">0</span>
      <span class="rts-res-label">Score</span>
    </div>
    <span id="rts-clock">00:00</span>
  </div>

  <!-- BODY -->
  <div id="rts-body">
    <div id="rts-center">

      <!-- SCREEN: HOME -->
      <div id="screen-home" class="screen">
        <div class="screen-grid-bg"></div>
        <div class="map-header">
          <span class="map-title">// Workflow Territory Map</span>
          <span class="map-blink">▶ Select Operation</span>
        </div>
        <div class="territory-grid" id="territory-grid">
          <!-- rendered by JS -->
        </div>
      </div>

      <!-- SCREEN: STAGE -->
      <div id="screen-stage" class="screen hidden">
        <div class="screen-grid-bg"></div>
        <div class="stage-header">
          <div class="stage-tag">
            <div class="stage-tag-label" id="stage-label"></div>
            <div class="stage-tag-name" id="stage-name"></div>
          </div>
          <div class="stage-meta">
            <div class="stage-q-of" id="stage-q-of"></div>
            <div class="stage-score-live" id="stage-score-live">+000</div>
          </div>
        </div>
        <div class="stage-progress"><div class="stage-progress-fill" id="stage-progress-fill"></div></div>
        <div id="question-host" style="display:flex;flex-direction:column;flex:1;position:relative;z-index:1;"></div>
      </div>

      <!-- SCREEN: COMPLETE -->
      <div id="screen-complete" class="screen hidden">
        <div class="cc-kicker">// Operation Complete</div>
        <div class="cc-title" id="cc-title">TERRITORY SECURED</div>
        <div class="cc-subtitle" id="cc-subtitle"></div>
        <div class="cc-score-box">
          <div class="cc-score-label">Stage Score</div>
          <div class="cc-score-val" id="cc-score-val">—</div>
          <div class="cc-score-pct">% Operational Maturity</div>
        </div>
        <div class="cc-xp" id="cc-xp"></div>
        <div class="cc-bar-wrap">
          <div class="cc-bar-label"><span id="cc-bar1-label">Stage Maturity</span><span id="cc-bar1-pct"></span></div>
          <div class="cc-bar"><div class="cc-bar-fill" id="cc-bar1-fill"></div></div>
        </div>
        <div class="cc-bar-wrap">
          <div class="cc-bar-label"><span>Overall Progress</span><span id="cc-bar2-pct"></span></div>
          <div class="cc-bar"><div class="cc-bar-fill" id="cc-bar2-fill"></div></div>
        </div>
      </div>

      <!-- SCREEN: DEBRIEF -->
      <div id="screen-debrief" class="screen hidden">
        <div class="screen-grid-bg"></div>
        <div class="db-kicker" id="db-kicker"></div>
        <div class="db-title" id="db-title"></div>
        <div class="db-profile-score" id="db-profile-score"></div>
        <div class="db-summary" id="db-summary"></div>
        <div class="db-grid" id="db-grid"></div>
        <div class="db-fixes">
          <div class="db-fixes-title">// Priority Fixes</div>
          <div id="db-fixes"></div>
        </div>
      </div>

    </div>

    <!-- SIDEBAR -->
    <div id="rts-sidebar">
      <div class="sidebar-title">Intel</div>
      <div class="sidebar-stat">
        <div class="sidebar-stat-name">Visibility</div>
        <div class="sidebar-bar"><div class="sidebar-bar-fill" id="sb-visibility" style="background:#4cc9f0"></div></div>
        <div class="sidebar-val" id="sbv-visibility">—</div>
      </div>
      <div class="sidebar-stat">
        <div class="sidebar-stat-name">Standard</div>
        <div class="sidebar-bar"><div class="sidebar-bar-fill" id="sb-standardization" style="background:#f72585"></div></div>
        <div class="sidebar-val" id="sbv-standardization">—</div>
      </div>
      <div class="sidebar-stat">
        <div class="sidebar-stat-name">Acct.</div>
        <div class="sidebar-bar"><div class="sidebar-bar-fill" id="sb-accountability" style="background:#7bed9f"></div></div>
        <div class="sidebar-val" id="sbv-accountability">—</div>
      </div>
      <div class="sidebar-divider"></div>
      <div class="sidebar-stat">
        <div class="sidebar-stat-name">Forecast</div>
        <div class="sidebar-bar"><div class="sidebar-bar-fill" id="sb-forecast" style="background:#ffd700"></div></div>
        <div class="sidebar-val" id="sbv-forecast">—</div>
      </div>
      <div class="sidebar-stat">
        <div class="sidebar-stat-name">Ops</div>
        <div class="sidebar-bar"><div class="sidebar-bar-fill" id="sb-ops" style="background:#ff9f43"></div></div>
        <div class="sidebar-val" id="sbv-ops">—</div>
      </div>
      <div class="sidebar-stat">
        <div class="sidebar-stat-name">Know.</div>
        <div class="sidebar-bar"><div class="sidebar-bar-fill" id="sb-knowledge" style="background:#a29bfe"></div></div>
        <div class="sidebar-val" id="sbv-knowledge">—</div>
      </div>
      <div class="sidebar-divider"></div>
      <div class="sidebar-stat">
        <div class="sidebar-stat-name">Scale</div>
        <div class="sidebar-bar"><div class="sidebar-bar-fill" id="sb-scalability" style="background:#fd79a8"></div></div>
        <div class="sidebar-val" id="sbv-scalability">—</div>
      </div>
      <div class="sidebar-stat">
        <div class="sidebar-stat-name">Cust.</div>
        <div class="sidebar-bar"><div class="sidebar-bar-fill" id="sb-customer" style="background:#55efc4"></div></div>
        <div class="sidebar-val" id="sbv-customer">—</div>
      </div>
    </div>
  </div>

  <!-- BOTTOM COMMAND BAR -->
  <div id="rts-cmdbar">
    <button class="cmd-btn" id="cmd-left"></button>
    <button class="cmd-btn primary" id="cmd-right"></button>
    <span id="cmd-status"></span>
  </div>

  <script>
    // DATA AND LOGIC ADDED IN SUBSEQUENT TASKS
  </script>
</body>
</html>
```

- [ ] **Step 2: Start dev server and verify static shell**

```bash
npm run start
```

Open `http://localhost:5173/arcade.html` in browser.

Expected: Dark page with the HUD chrome visible — resource bar at top showing "CF SYS | 0 Vis | 0 Ops | 0 Score | 00:00", empty right sidebar with 8 stat slots, empty command bar at bottom. Center is dark with grid lines.

- [ ] **Step 3: Commit**

```bash
git add arcade.html
git commit -m "feat: add arcade.html — full RTS CSS scaffold and HUD shell"
```

---

## Task 2: Data Layer + State

**Files:**
- Modify: `arcade.html` — replace the `// DATA AND LOGIC` comment in `<script>` with the data and state below

- [ ] **Step 1: Replace the script comment with data arrays**

Copy the `categories`, `questions`, and `profiles` objects verbatim from `index.html:559–618`. Paste them at the top of the `<script>` block. Then add the stage mapping and state variables immediately after:

```js
// ── STAGE MAPPING ─────────────────────────────────────
// 9 stages, each maps to 3 consecutive questions by index
const STAGE_NAMES = [
  'Lead Intelligence',
  'Estimating & Proposals',
  'Accountability & Ownership',
  'Forecasting & Revenue',
  'Communication & Decisions',
  'Ops Readiness Before Close',
  'Process Variability',
  'Customer Experience',
  'Automation Readiness'
];

// Returns [startIdx, startIdx+1, startIdx+2]
function stageQuestionIndices(stageIndex) {
  const start = stageIndex * 3;
  return [start, start + 1, start + 2];
}

// ── STATE ──────────────────────────────────────────────
let answers = Array(27).fill(null);      // selected option index per question (-1 for text)
let textAnswers = Array(27).fill('');    // open-text content per question
let completedStages = new Set();         // Set<stageIndex> of finished stages
let stageScorePct = {};                  // { stageIndex: number } percentage 0–100
let currentStage = null;                 // null = home screen
let currentQuestionInStage = 0;          // 0 | 1 | 2
let clockSeconds = 0;
let clockInterval = null;
```

- [ ] **Step 2: Add helper functions after state variables**

```js
// ── SCORE HELPERS ──────────────────────────────────────
function categoryScores() {
  const totals = Object.fromEntries(
    Object.keys(categories).map(k => [k, { earned: 0, possible: 0 }])
  );
  questions.forEach((q, i) => {
    if (q.type === 'text' || !q.scores?.length || answers[i] === null) return;
    const value = q.options[answers[i]][1];
    q.scores.forEach(cat => {
      totals[cat].earned += value;
      totals[cat].possible += 4;
    });
  });
  return totals;
}

function overallScore() {
  const totals = categoryScores();
  const earned = Object.values(totals).reduce((s, t) => s + t.earned, 0);
  const possible = Object.values(totals).reduce((s, t) => s + t.possible, 0);
  return possible ? Math.round((earned / possible) * 100) : 0;
}

function profileFor(score) {
  return profiles.filter(p => score >= p.min).slice(-1)[0];
}

function rankedCategories() {
  const totals = categoryScores();
  return Object.entries(totals).map(([key, t]) => ({
    key,
    pct: t.possible ? Math.round((t.earned / t.possible) * 100) : 0,
    earned: t.earned,
    possible: t.possible
  })).sort((a, b) => a.pct - b.pct);
}

// Stage score: maturity % across only the questions in that stage
function computeStageScore(stageIndex) {
  const indices = stageQuestionIndices(stageIndex);
  let earned = 0, possible = 0;
  indices.forEach(i => {
    const q = questions[i];
    if (q.type === 'text' || !q.scores?.length || answers[i] === null) return;
    earned += q.options[answers[i]][1];
    possible += 4;
  });
  return possible ? Math.round((earned / possible) * 100) : 0;
}
```

- [ ] **Step 3: Verify no console errors**

Reload `http://localhost:5173/arcade.html`. Open browser DevTools console.

Expected: No errors. `questions.length` in console should return `27`. `STAGE_NAMES.length` should return `9`.

- [ ] **Step 4: Commit**

```bash
git add arcade.html
git commit -m "feat: embed quiz data and state variables in arcade.html"
```

---

## Task 3: HUD Update Functions + Clock

**Files:**
- Modify: `arcade.html` — add functions to `<script>`

- [ ] **Step 1: Add updateSidebar(), updateResourceBar(), startClock()**

```js
// ── HUD UPDATE ─────────────────────────────────────────
function updateSidebar() {
  const totals = categoryScores();
  Object.entries(totals).forEach(([key, t]) => {
    const pct = t.possible ? Math.round((t.earned / t.possible) * 100) : 0;
    const fill = document.getElementById('sb-' + key);
    const val  = document.getElementById('sbv-' + key);
    if (!fill || !val) return;
    fill.style.width = (t.possible ? pct : 0) + '%';
    val.textContent = t.possible ? pct + '%' : '—';
    val.style.color = t.possible ? '' : '#3a4a5a';
  });
}

// Cosmetic multipliers for the resource counters
function updateResourceBar() {
  const totals = categoryScores();
  const visPct = totals.visibility.possible
    ? Math.round((totals.visibility.earned / totals.visibility.possible) * 100) : 0;
  const opsPct = totals.ops.possible
    ? Math.round((totals.ops.earned / totals.ops.possible) * 100) : 0;
  const rawTotal = Object.values(totals).reduce((s, t) => s + t.earned, 0);

  animateCounter('res-vis',   Math.round(visPct * 22));
  animateCounter('res-ops',   Math.round(opsPct * 18));
  animateCounter('res-score', Math.round(rawTotal * 75));
}

// Ticks displayed counter toward target over ~20 frames
const _counterTargets = {};
function animateCounter(id, target) {
  _counterTargets[id] = target;
  const el = document.getElementById(id);
  if (!el) return;
  const current = parseInt(el.textContent.replace(/,/g, ''), 10) || 0;
  const delta = target - current;
  if (delta === 0) return;
  let frame = 0;
  const total = 20;
  const tick = () => {
    frame++;
    const progress = frame / total;
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(current + delta * eased).toLocaleString();
    if (frame < total && _counterTargets[id] === target) requestAnimationFrame(tick);
    else if (_counterTargets[id] === target) el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(tick);
}

function startClock() {
  if (clockInterval) return;
  clockInterval = setInterval(() => {
    clockSeconds++;
    const m = String(Math.floor(clockSeconds / 60)).padStart(2, '0');
    const s = String(clockSeconds % 60).padStart(2, '0');
    document.getElementById('rts-clock').textContent = m + ':' + s;
  }, 1000);
}
```

- [ ] **Step 2: Add showScreen() helper**

```js
// ── SCREEN ROUTING ─────────────────────────────────────
const SCREENS = ['screen-home', 'screen-stage', 'screen-complete', 'screen-debrief'];
function showScreen(name) {
  SCREENS.forEach(id => {
    document.getElementById(id).classList.toggle('hidden', id !== name);
  });
}
```

- [ ] **Step 3: Add DOMContentLoaded bootstrap at bottom of script**

```js
// ── BOOTSTRAP ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  startClock();
  renderHome();
});
```

- [ ] **Step 4: Add a stub renderHome() so the page doesn't error**

```js
function renderHome() {
  showScreen('screen-home');
  updateSidebar();
  updateResourceBar();
  // territory grid rendered in Task 4
  document.getElementById('cmd-left').textContent = '';
  document.getElementById('cmd-left').style.display = 'none';
  document.getElementById('cmd-right').textContent = '▶ Select Operation';
  document.getElementById('cmd-right').disabled = true;
  document.getElementById('cmd-status').innerHTML = '1 / 9 Operations Complete';
}
```

- [ ] **Step 5: Verify clock ticks**

Reload `http://localhost:5173/arcade.html`. Watch the clock in the top-right of the resource bar.

Expected: Clock counts up from 00:00 each second. No console errors.

- [ ] **Step 6: Commit**

```bash
git add arcade.html
git commit -m "feat: add HUD update functions, counter animation, clock, and screen router"
```

---

## Task 4: Home Screen — Territory Grid

**Files:**
- Modify: `arcade.html` — replace stub `renderHome()` with full implementation

- [ ] **Step 1: Replace renderHome() with the full version**

```js
function renderHome() {
  showScreen('screen-home');
  updateSidebar();
  updateResourceBar();

  const fogCleared = completedStages.size > 0;
  const grid = document.getElementById('territory-grid');
  grid.innerHTML = STAGE_NAMES.map((name, i) => {
    const done = completedStages.has(i);
    const inFog = !fogCleared && i >= 7;
    const score = done ? stageScorePct[i] : null;
    const pipsDone = done ? 3 : 0;
    const pipsHtml = [0,1,2].map(p => `<div class="pip${p < pipsDone ? ' done' : ''}"></div>`).join('');
    return `
      <div class="territory${done ? ' captured' : ''}${inFog ? ' fog' : ''}"
           onclick="enterStage(${i})"
           title="${name}">
        <div class="t-num">Op-${String(i+1).padStart(2,'0')}</div>
        <div class="t-name">${name}</div>
        ${done ? `<div class="t-score">▲ ${score}%</div>` : ''}
        ${!inFog ? `<div class="t-pips">${pipsHtml}</div>` : ''}
      </div>`;
  }).join('');

  const remaining = 9 - completedStages.size;
  document.getElementById('cmd-left').style.display = 'none';
  document.getElementById('cmd-right').textContent = '▶ Select an Operation';
  document.getElementById('cmd-right').disabled = true;
  document.getElementById('cmd-right').onclick = null;
  document.getElementById('cmd-status').innerHTML =
    `<span>${completedStages.size}</span> / 9 Operations Complete &nbsp;·&nbsp; ${remaining} Remaining`;
}
```

- [ ] **Step 2: Add enterStage()**

```js
function enterStage(stageIndex) {
  currentStage = stageIndex;
  // If replaying a completed stage, reset its answers
  if (completedStages.has(stageIndex)) {
    stageQuestionIndices(stageIndex).forEach(i => {
      answers[i] = null;
      textAnswers[i] = '';
    });
    completedStages.delete(stageIndex);
    delete stageScorePct[stageIndex];
  }
  currentQuestionInStage = 0;
  renderStageScreen();
}
```

- [ ] **Step 3: Add a stub renderStageScreen() to avoid errors on click**

```js
function renderStageScreen() {
  showScreen('screen-stage');
  document.getElementById('stage-label').textContent =
    `▶ Operation ${String(currentStage + 1).padStart(2,'0')} · Active`;
  document.getElementById('stage-name').textContent = STAGE_NAMES[currentStage];
  document.getElementById('cmd-status').innerHTML =
    `Op-${String(currentStage+1).padStart(2,'0')} <span>${STAGE_NAMES[currentStage]}</span>`;
  // question rendering added in Task 5
}
```

- [ ] **Step 4: Verify territory grid renders and clicking enters stage screen**

Reload `http://localhost:5173/arcade.html`.

Expected: 9 territory tiles in a 3×3 grid. All tiles available (none captured). Clicking any tile shows the stage screen (dark background, stage name in header). No console errors.

- [ ] **Step 5: Commit**

```bash
git add arcade.html
git commit -m "feat: render territory grid and wire enterStage navigation"
```

---

## Task 5: In-Stage Quiz — Question Rendering + Answer Selection

**Files:**
- Modify: `arcade.html` — replace stub `renderStageScreen()` with full version; add question rendering

- [ ] **Step 1: Replace renderStageScreen() with the full version**

```js
function renderStageScreen() {
  showScreen('screen-stage');

  const qIdx = stageQuestionIndices(currentStage)[currentQuestionInStage];
  const q = questions[qIdx];
  const qNum = currentQuestionInStage + 1;
  const isText = q.type === 'text';
  const isAnswered = isText
    ? textAnswers[qIdx].trim().length > 0
    : answers[qIdx] !== null;

  // Stage header
  document.getElementById('stage-label').textContent =
    `▶ Operation ${String(currentStage+1).padStart(2,'0')} · Active`;
  document.getElementById('stage-name').textContent = STAGE_NAMES[currentStage];
  document.getElementById('stage-q-of').textContent =
    `Question ${String(qNum).padStart(2,'0')} / 03`;

  // Live score for this stage so far
  const partialScore = computeStageScore(currentStage);
  document.getElementById('stage-score-live').textContent =
    '+' + String(partialScore).padStart(3,'0');

  // Progress bar
  document.getElementById('stage-progress-fill').style.width =
    (currentQuestionInStage / 3 * 100) + '%';

  // Question host
  const host = document.getElementById('question-host');
  if (isText) {
    host.innerHTML = `
      <div class="q-why">↳ ${q.why}</div>
      <div class="q-text">${q.q}</div>
      <div class="q-intel-label">// Intel Input</div>
      <textarea class="q-textarea" id="q-textarea"
        placeholder="${q.placeholder || 'Type your intel report...'}"
      >${textAnswers[qIdx]}</textarea>
    `;
    document.getElementById('q-textarea').addEventListener('input', e => {
      textAnswers[qIdx] = e.target.value;
      updateNextBtn();
    });
  } else {
    host.innerHTML = `
      <div class="q-why">↳ ${q.why}</div>
      <div class="q-text">${q.q}</div>
      <div class="q-options">
        ${q.options.map((opt, i) => `
          <div class="q-option${answers[qIdx] === i ? ' selected' : ''}"
               onclick="selectAnswer(${i})">
            <span class="q-letter">${String.fromCharCode(65+i)}</span>
            <span class="q-opt-text">${opt[0]}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Command bar
  const isLastQ = currentQuestionInStage === 2;
  const isTextQ = isText;
  document.getElementById('cmd-left').style.display = '';
  document.getElementById('cmd-left').textContent = '◀ Abort';
  document.getElementById('cmd-left').onclick = abortStage;
  document.getElementById('cmd-right').textContent = isLastQ
    ? (isTextQ ? 'Submit Intel ▶' : 'Complete Op ▶')
    : (isTextQ ? 'Submit Intel ▶' : 'Next ▶');
  document.getElementById('cmd-right').disabled = !isAnswered;
  document.getElementById('cmd-right').onclick = nextQuestion;
  document.getElementById('cmd-status').innerHTML =
    isAnswered
      ? `<span>[${isText ? 'INTEL' : String.fromCharCode(65 + (answers[qIdx] ?? 0))}]</span> — Press Enter to advance`
      : 'Awaiting Input';

  updateSidebar();
  updateResourceBar();
}

function updateNextBtn() {
  const qIdx = stageQuestionIndices(currentStage)[currentQuestionInStage];
  const q = questions[qIdx];
  const isAnswered = q.type === 'text'
    ? textAnswers[qIdx].trim().length > 0
    : answers[qIdx] !== null;
  document.getElementById('cmd-right').disabled = !isAnswered;
  document.getElementById('cmd-status').innerHTML = isAnswered
    ? `<span>[INTEL]</span> — Press Enter to advance`
    : 'Awaiting Input';
}
```

- [ ] **Step 2: Add selectAnswer()**

```js
function selectAnswer(optionIndex) {
  const qIdx = stageQuestionIndices(currentStage)[currentQuestionInStage];
  answers[qIdx] = optionIndex;
  renderStageScreen(); // re-renders with selected state
}
```

- [ ] **Step 3: Add nextQuestion() and abortStage()**

```js
function nextQuestion() {
  const qIdx = stageQuestionIndices(currentStage)[currentQuestionInStage];
  const q = questions[qIdx];
  const isAnswered = q.type === 'text'
    ? textAnswers[qIdx].trim().length > 0
    : answers[qIdx] !== null;
  if (!isAnswered) return;

  if (currentQuestionInStage < 2) {
    currentQuestionInStage++;
    renderStageScreen();
  } else {
    finishStage();
  }
}

function abortStage() {
  currentStage = null;
  currentQuestionInStage = 0;
  renderHome();
}
```

- [ ] **Step 4: Add Enter key handler at the bottom of the script (before closing tag)**

```js
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter' || e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) return;
  // Only active during stage quiz
  if (currentStage === null) return;
  const activeEl = document.activeElement;
  // Don't intercept Enter inside abort button
  if (activeEl && activeEl.id === 'cmd-left') return;
  // For textareas, allow Shift+Enter for newline (already guarded above)
  const qIdx = stageQuestionIndices(currentStage)[currentQuestionInStage];
  const q = questions[qIdx];
  if (q.type === 'text' && activeEl && activeEl.id === 'q-textarea') {
    textAnswers[qIdx] = activeEl.value;
  }
  e.preventDefault();
  nextQuestion();
});
```

- [ ] **Step 5: Verify full question flow**

Reload `http://localhost:5173/arcade.html`.

Expected:
- Click any territory tile → stage quiz screen shows
- "Why this matters" hint in gold, question text in big Bebas Neue
- Click an option → it highlights green, "Next ▶" button enables
- Press Enter → advances to question 2, then question 3
- "Abort" button → returns to territory map
- Stage 8 (Automation Readiness): Q2 and Q3 show a dark textarea instead of options

- [ ] **Step 6: Commit**

```bash
git add arcade.html
git commit -m "feat: render stage questions with answer selection and Enter key navigation"
```

---

## Task 6: Stage Complete Screen

**Files:**
- Modify: `arcade.html` — add `finishStage()` and `renderStageComplete()`

- [ ] **Step 1: Add finishStage()**

```js
function finishStage() {
  const score = computeStageScore(currentStage);
  completedStages.add(currentStage);
  stageScorePct[currentStage] = score;
  renderStageComplete(currentStage, score);
}
```

- [ ] **Step 2: Add renderStageComplete()**

```js
function renderStageComplete(stageIndex, score) {
  showScreen('screen-complete');

  const stagesComplete = completedStages.size;
  const overallPct = Math.round((stagesComplete / 9) * 100);
  const points = Math.round(score * 3);

  document.getElementById('cc-subtitle').textContent =
    `Operation ${String(stageIndex+1).padStart(2,'0')} — ${STAGE_NAMES[stageIndex]}`;
  document.getElementById('cc-score-val').textContent = score;
  document.getElementById('cc-xp').textContent = `+ ${points} Score Points Earned`;

  // Bar 1: stage score
  document.getElementById('cc-bar1-label').textContent = STAGE_NAMES[stageIndex] + ' Maturity';
  document.getElementById('cc-bar1-pct').textContent = score + '%';
  requestAnimationFrame(() => {
    document.getElementById('cc-bar1-fill').style.width = score + '%';
    document.getElementById('cc-bar2-fill').style.width = overallPct + '%';
  });
  document.getElementById('cc-bar2-pct').textContent =
    `${stagesComplete} / 9`;

  // Command bar
  document.getElementById('cmd-left').style.display = 'none';
  document.getElementById('cmd-right').textContent = '◀ Return to Map';
  document.getElementById('cmd-right').disabled = false;
  document.getElementById('cmd-right').onclick = returnToMap;
  document.getElementById('cmd-status').innerHTML =
    `${9 - stagesComplete} Operations Remaining`;

  updateSidebar();
  updateResourceBar();
}

function returnToMap() {
  if (completedStages.size === 9) {
    renderDebrief();
  } else {
    currentStage = null;
    currentQuestionInStage = 0;
    renderHome();
  }
}
```

- [ ] **Step 3: Verify stage complete screen**

Reload. Play through all 3 questions of any stage.

Expected:
- "TERRITORY SECURED" screen appears
- Score % shown in the large number box
- Score points earned shown in gold
- Stage maturity bar animates to the score %
- Overall progress bar animates to N/9
- "Return to Map" button goes back to territory grid
- Completed tile shows green border, green left strip, score %, all 3 pips filled

- [ ] **Step 4: Commit**

```bash
git add arcade.html
git commit -m "feat: add stage complete screen and territory capture flow"
```

---

## Task 7: Mission Debrief Screen

**Files:**
- Modify: `arcade.html` — add `renderDebrief()`

- [ ] **Step 1: Add renderDebrief()**

```js
function renderDebrief() {
  showScreen('screen-debrief');
  const score = overallScore();
  const profile = profileFor(score);
  const ranked = rankedCategories();
  const weakest = ranked.slice(0, 2);
  const strongest = ranked.slice(-2).reverse();

  document.getElementById('db-kicker').textContent =
    '// Mission Complete — All 9 Territories Secured';
  document.getElementById('db-title').textContent = profile.name;
  document.getElementById('db-profile-score').textContent =
    score + '% Operational Maturity Score';
  document.getElementById('db-summary').textContent = profile.summary;

  const cardHtml = (items, type) => items.map(item => `
    <div class="db-card ${type}">
      <div class="db-card-label">${type === 'gap' ? '↓ Priority Gap' : '↑ Relative Strength'}</div>
      <div class="db-card-name">${categories[item.key].name}</div>
      <div class="db-card-score">${item.pct}%</div>
      <div class="db-bar"><div class="db-bar-fill" style="width:${item.pct}%"></div></div>
    </div>
  `).join('');

  document.getElementById('db-grid').innerHTML =
    cardHtml(weakest, 'gap') + cardHtml(strongest, 'strength');

  document.getElementById('db-fixes').innerHTML = profile.priority.map((fix, i) => `
    <div class="db-fix"><span>${String(i+1).padStart(2,'0')}.</span>${fix}</div>
  `).join('');

  // Command bar
  document.getElementById('cmd-left').style.display = '';
  document.getElementById('cmd-left').textContent = 'Replay';
  document.getElementById('cmd-left').onclick = replayAll;
  document.getElementById('cmd-right').textContent = '↓ Download Report';
  document.getElementById('cmd-right').disabled = false;
  document.getElementById('cmd-right').onclick = downloadReport;
  document.getElementById('cmd-status').innerHTML =
    `Mission Complete &nbsp;·&nbsp; <span>${score}%</span> Maturity`;

  updateSidebar();
  updateResourceBar();
}

function replayAll() {
  answers.fill(null);
  textAnswers.fill('');
  completedStages.clear();
  stageScorePct = {};
  currentStage = null;
  currentQuestionInStage = 0;
  clockSeconds = 0;
  updateSidebar();
  updateResourceBar();
  renderHome();
}
```

- [ ] **Step 2: Verify debrief triggers after all 9 stages**

Complete all 9 stages (you can answer each question with option A for speed).

Expected:
- After last "Return to Map" with 9/9 complete → debrief appears
- Profile name and score display correctly
- 4 cards: 2 gaps (red-tinted border), 2 strengths (green-tinted border)
- Priority fixes show 3 numbered items
- "Replay" resets everything and returns to territory map

- [ ] **Step 3: Commit**

```bash
git add arcade.html
git commit -m "feat: add mission debrief screen with maturity profile and replay"
```

---

## Task 8: Report Download

**Files:**
- Modify: `arcade.html` — add `escapeReportHtml()`, `buildReportHtml()`, `downloadReport()`

- [ ] **Step 1: Add escapeReportHtml() and buildReportHtml()**

Adapted from `index.html:743–858`. Add inside `<script>`:

```js
function escapeReportHtml(v = '') {
  return String(v)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

function buildReportHtml() {
  const score = overallScore();
  const profile = profileFor(score);
  const ranked = rankedCategories();
  const weakest = ranked.slice(0, 3);
  const strongest = ranked.slice(-3).reverse();
  const generatedAt = new Date().toLocaleDateString(undefined, { year:'numeric', month:'long', day:'numeric' });

  const categoryRows = ranked.map(item => `
    <tr>
      <td>${escapeReportHtml(categories[item.key].name)}</td>
      <td>${item.pct}%</td>
      <td>${escapeReportHtml(categories[item.key].description)}</td>
    </tr>`).join('');

  const priorityItems = profile.priority.map(p => `<li>${escapeReportHtml(p)}</li>`).join('');
  const gapItems = weakest.map(item =>
    `<li><strong>${escapeReportHtml(categories[item.key].name)}:</strong> ${item.pct}% — ${escapeReportHtml(categories[item.key].description)}</li>`
  ).join('');
  const strengthItems = strongest.map(item =>
    `<li><strong>${escapeReportHtml(categories[item.key].name)}:</strong> ${item.pct}% — ${escapeReportHtml(categories[item.key].description)}</li>`
  ).join('');

  const answerRows = questions.map((q, i) => {
    const ans = q.type === 'text'
      ? (textAnswers[i] || 'No response captured.')
      : (answers[i] === null ? 'Not answered' : q.options[answers[i]][0]);
    return `<tr>
      <td>${String(i+1).padStart(2,'0')}</td>
      <td>${escapeReportHtml(q.section)}</td>
      <td>${escapeReportHtml(q.q)}</td>
      <td>${escapeReportHtml(ans)}</td>
    </tr>`;
  }).join('');

  return `<!doctype html><html lang="en"><head><meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Construct Flows Operational Maturity Report</title>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box}body{margin:0;padding:34px;font-family:'Inter',Arial,sans-serif;color:#111;background:#F6F4EF;line-height:1.7}
    .report{max-width:980px;margin:0 auto;background:#fff;border:1px solid #E5E5E5}
    header{padding:30px;border-bottom:1px solid #E5E5E5}
    h1,h2,h3{font-family:'Bebas Neue',Impact,sans-serif;text-transform:uppercase;line-height:.92;margin:0;letter-spacing:-1px;color:#111;font-weight:700}
    h1{font-size:58px;max-width:820px}h2{font-size:38px;margin:34px 0 14px}h3{font-family:'IBM Plex Mono',monospace;font-size:24px;margin:24px 0 10px;letter-spacing:0}
    .kicker{display:inline-block;border:1px solid #E5E5E5;padding:6px 10px;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:1px;color:#686868;margin-bottom:18px}
    .content{padding:30px}.score{display:inline-block;border:1px solid #111;background:#111;color:#fff;padding:8px 12px;font-family:'IBM Plex Mono',monospace;font-weight:500;text-transform:uppercase;letter-spacing:1px;margin:18px 0;font-size:11px}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:0;border:1px solid #E5E5E5;margin-top:18px}
    .card{padding:20px;border-right:1px solid #E5E5E5;background:#fff}.card:last-child{border-right:0}
    .card p{color:#686868;font-weight:400;font-size:14px}
    table{width:100%;border-collapse:collapse;margin-top:14px}th,td{border:1px solid #E5E5E5;padding:10px;vertical-align:top;text-align:left;font-size:13px}
    th{background:#111;color:#fff;text-transform:uppercase;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:1px;font-weight:500}
    ul{padding-left:20px;margin:10px 0}ul li{color:#686868;font-weight:400;margin-bottom:6px;line-height:1.6}p{color:#686868;font-weight:400}
    .footer{padding:18px 30px;border-top:1px solid #E5E5E5;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:1px;display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;color:#686868}
    @media print{body{background:#fff;padding:0}.report{border:0}}
  </style></head><body>
  <article class="report">
    <header>
      <div class="kicker">Construct Flows assessment report</div>
      <h1>${escapeReportHtml(profile.name)}</h1>
      <div class="score">${score}% operational maturity score</div>
      <p>${escapeReportHtml(profile.summary)}</p>
      <p><strong>Generated:</strong> ${escapeReportHtml(generatedAt)}</p>
    </header>
    <div class="content">
      <h2>What this means</h2>
      <p>This report shows where the sales workflow is most likely creating visibility gaps, ownership gaps, handoff friction, forecasting risk, customer confusion, or downstream execution problems.</p>
      <div class="grid">
        <div class="card"><h3>Priority gaps</h3><ul>${gapItems}</ul></div>
        <div class="card"><h3>Relative strengths</h3><ul>${strengthItems}</ul></div>
      </div>
      <h2>First workflow fixes</h2><ul>${priorityItems}</ul>
      <h2>Category scores</h2>
      <table><thead><tr><th>Category</th><th>Score</th><th>What it measures</th></tr></thead><tbody>${categoryRows}</tbody></table>
      <h2>Assessment answers</h2>
      <table><thead><tr><th>#</th><th>Section</th><th>Question</th><th>Answer</th></tr></thead><tbody>${answerRows}</tbody></table>
    </div>
    <div class="footer"><span>Construct Flows</span><span>Better workflows. Fewer loose ends.</span></div>
  </article></body></html>`;
}

function downloadReport() {
  const html = buildReportHtml();
  const score = overallScore();
  const profile = profileFor(score);
  const slug = profile.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `constructionflows-operational-maturity-${slug}-${score}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
```

- [ ] **Step 2: Verify report download**

Complete all 9 stages, reach the debrief, click "↓ Download Report".

Expected: Browser downloads an HTML file. Open it — it should show the full report with all category scores, answers, profile name, and priority fixes.

- [ ] **Step 3: Commit**

```bash
git add arcade.html
git commit -m "feat: add report download to mission debrief"
```

---

## Task 9: Fog of War, Vite Config, gitignore

**Files:**
- Modify: `arcade.html` — fog-of-war clears after first completion (already handled in renderHome, verify)
- Modify: `vite.config.js` — add arcade.html to build inputs
- Modify: `.gitignore` — add `.superpowers/`

- [ ] **Step 1: Confirm fog-of-war behaviour in renderHome()**

The existing `renderHome()` already computes `fogCleared = completedStages.size > 0` and applies the `fog` class to stages 7 and 8 when zero stages are complete. Verify:

Open `http://localhost:5173/arcade.html`. Stages 7 (Customer Experience) and 8 (Automation Readiness) should be visually dimmed (22% opacity). Complete any other stage and return to map — stages 7 and 8 should now be fully visible and clickable.

Expected: Fog clears for stages 7–8 after the first stage completion.

- [ ] **Step 2: Add arcade.html to vite.config.js build inputs**

Open `vite.config.js`. Add `arcade` to the `input` object:

```js
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        contact: resolve(__dirname, 'contact.html'),
        thankYou: resolve(__dirname, 'thank-you.html'),
        arcade: resolve(__dirname, 'arcade.html'),
      }
    }
  }
});
```

- [ ] **Step 3: Add .superpowers/ to .gitignore**

Open `.gitignore` (create it if it doesn't exist). Add:

```
.superpowers/
```

- [ ] **Step 4: Run a production build to confirm no errors**

```bash
npm run build
```

Expected: Build completes with no errors. `dist/` directory contains `arcade.html` alongside the other pages.

- [ ] **Step 5: Full end-to-end smoke test**

Open `http://localhost:5173/arcade.html` in browser:

1. Clock starts at 00:00 and ticks
2. Territory map shows 9 tiles; tiles 7 & 8 are dimmed
3. Click Op-01 (Lead Intelligence) → stage quiz opens, 3 questions
4. Answer all 3 questions → "Territory Secured" screen, score shown, bar animates
5. "Return to Map" → tile 01 shows green, score %, all pips filled; tiles 7 & 8 now visible
6. Complete ops 02–09
7. After Op-09 → "Return to Map" → Mission Debrief appears
8. Profile name, score, 4 cards (2 gaps, 2 strengths), 3 priority fixes displayed
9. "↓ Download Report" → HTML file downloads and opens correctly
10. "Replay" → all state resets, back to territory map with 0 captures

- [ ] **Step 6: Final commit**

```bash
git add arcade.html vite.config.js .gitignore
git commit -m "feat: complete arcade strategy quiz — fog of war, build config, gitignore"
```

---

## Self-Review Notes

**Spec coverage check:**

| Spec requirement | Task |
|-----------------|------|
| Single `arcade.html` file | Task 1 |
| RTS topbar with Vis/Ops/Score/Clock | Task 1, 3 |
| 8-category sidebar bars, live update | Task 1, 3 |
| Context-sensitive command panel | Tasks 3–8 |
| 3×3 territory grid, tile states | Task 4 |
| Fog of war on stages 7–8 | Task 4, 9 |
| Single-click enters stage | Task 4 |
| Stage replay (re-entering captured tile) | Task 4 (`enterStage`) |
| In-stage quiz: 3 questions per stage | Task 5 |
| Multiple choice options, selected state | Task 5 |
| Text question textarea with `// Intel Input` label | Task 5 |
| Enter key navigation | Task 5 |
| Abort returns to map | Task 5 |
| Progress bar 33%/66%/100% | Task 5 |
| Stage complete: "Territory Secured" | Task 6 |
| Stage score %, XP, progress bars | Task 6 |
| Debrief after all 9 complete | Task 7 |
| Profile name, score, gaps, strengths, fixes | Task 7 |
| Report download (identical to index.html) | Task 8 |
| Replay resets all state | Task 7 |
| Vite build includes arcade.html | Task 9 |
| `.superpowers/` gitignored | Task 9 |

All spec requirements covered.
