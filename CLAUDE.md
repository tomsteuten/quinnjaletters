# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

**Active project directory.** Never use or reference `C:\Users\TomSteuten\OneDrive - Dunbrae Group\Desktop\Quinnja Letters` — that is a legacy copy.

## What This Project Is

Quinnja Letters is a tablet-first literacy game for pre-K / kindergarten children. A mascot character (Quinnja) guides children through learning letters (S, A, T, P, I, N) in a loop of: meet the letter → pick it from options → trace it on canvas → celebrate. Pure HTML/CSS/JS, no frameworks, no build step.

## Development

Open `index.html` in Chrome. No build, no tests, no linter. Test on both desktop and tablet viewports.

## File Roles

| File | Purpose |
|------|---------|
| `index.html` | All markup. Sections map 1:1 to game stages. Script load order: data → audio → speech → nfc → app. |
| `data.js` | Letter definitions array (`LETTERS`). Each letter: id, cases, colours, audio paths, formation strokes, ghost paths, start dot. Shared audio paths too. |
| `audio.js` | Web Audio API tones + MP3 playback. Key exports: `playCorrectChime()`, `playTryAgainTone()`, `playButtonTap()`, `playCelebrationSequence()`, `playMp3Sequence()`, `playRandomMp3()`. Context lazy-created on first user gesture. |
| `speech.js` | Browser SpeechSynthesis for dynamic phrases (e.g. child's name in praise). Supplement only — core letter audio is pre-recorded MP3. |
| `nfc.js` | Optional Web NFC. Parses tags in `ql:letterId` format. `onTag` callback wired in `app.js`. |
| `app.js` | All game logic, stage transitions, canvas tracing, settings UI, progress tracking, mascot state, NFC integration. |
| `styles.css` | All styling. CSS custom properties at `:root`. No preprocessor. |

Other files in root (`appbu.js`, `*.zip`, `convert-greenscreen.ps1`, `summary.txt`, `tools/`) are dev artefacts — not loaded by the game.

## Game Stage Flow

```
home → meet → pick → trace → celebrate → [next letter or complete]
```

| Stage | What happens | Key elements |
|-------|-------------|--------------|
| **home** | Active letters grid, progress dots, settings gear | `#home-stage` |
| **meet** | Quinnja introduces letter with audio | `#meet-stage`, continue arrow |
| **pick** | Child taps correct letter from 4 options | `#pick-stage`, wrong taps animate + tone |
| **trace** | Canvas drawing over SVG ghost guide, hit-mask validation | `#trace-stage`, Clear/Done buttons, progress ring |
| **celebrate** | Sparkle animation, then next letter or complete | `#celebrate-stage` |
| **complete** | Shows all practised letters, replay or home | `#complete-stage` |

Global Home button (`#btn-global-home`) shows a confirmation overlay before exiting mid-session.

## Key UI Components — Where They Live

| Component | HTML | CSS | JS |
|-----------|------|-----|----|
| **Trace progress ring** (green arc between Clear/Done) | `index.html` ~line 197: static SVG `#trace-progress-ring` with two `<circle>` elements | `styles.css` ~line 517: `.trace-progress-ring`, `.trace-progress-fill` uses `stroke-dasharray`/`stroke-dashoffset` | `app.js` ~line 1474: `updateTraceProgressRing()` sets dashoffset based on `coveredCells / totalLetterCells` |
| **Mascot** | `#mascot-wrap` > `#mascot-img` | Stage-specific classes: `mascot-home`, `mascot-meet`, `mascot-pick`, `mascot-trace`, `mascot-celebrate` | Positioned via class swap in stage transitions |
| **Trace canvas** | `#trace-canvas` (220×220) + `#trace-guide` SVG | `.trace-canvas-wrap` | Hit mask pixel-sampled; alignment is letter-specific (see `formation` in `data.js`) |

## State Architecture

All runtime state is in `app.js` module-level variables — no `window` globals. Key state:

- `letterQueue` — shuffled letter IDs for the session
- `currentLetterIndex` — pointer into queue
- `traceAttempts` — count per letter
- `sessionProgress` — map of letterId → `{met, picked, traced}`

**localStorage** stores only parent settings (child name, active letters, display case, audio toggles, NFC mode). Read on load, written on Settings save. Session state is never persisted.

## Trace System

Canvas is 220×220. Ghost letter guide is font-rendered in `#trace-guide` SVG (not raw SVG paths). Hit detection uses a pixel-sampled hit mask. The progress ring (SVG, not canvas-drawn) fills as coverage increases.

**If tracing feels broken for one letter:** check its `formation` entry in `data.js` first — hit mask alignment and tolerance are tuned per letter.

## Audio

- `AudioContext` requires a user gesture before creation (browser autoplay policy).
- MP3 paths defined in `data.js`. Missing files fail silently.
- Two separate settings toggles: speech audio (`setting-audio`) and sound effects (`setting-sound-effects`).

## Adding a New Letter

1. Add entry to `LETTERS` array in `data.js` (follow existing schema).
2. Add MP3 files to `assets/audio/`.
3. Letter auto-appears in Settings toggle grid.

## Working Style

The project owner is a non-coder working on a tablet. When making changes:

- Make one focused change at a time. Do not bundle unrelated fixes.
- Always use `/plan` mode for non-trivial changes — research first, propose, then execute.
- After each successful change, offer to update this file with what changed and where.
- Commit after each working change so rollback is always easy.
- When asked about a UI element, check the static HTML first before assuming it's dynamically inserted.
