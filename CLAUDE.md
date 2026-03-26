# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This is the active project directory. Never use or reference `C:\Users\TomSteuten\OneDrive - Dunbrae Group\Desktop\Quinnja Letters` — that is a legacy copy.

## Development

No build step. Open `index.html` directly in a browser or serve with any static server:

```bash
npx serve .
# or
python -m http.server 8080
```

Test in Chrome on both desktop and tablet viewports. There are no tests, no linter, no CI.

## File Roles

| File | Purpose |
|------|---------|
| `index.html` | All markup. Sections map 1:1 to game stages. Script load order matters: data → audio → nfc → app. |
| `data.js` | Letter definitions (S, A, T, P, I, N). Each letter carries colours, audio paths, trace stroke geometry, ghost paths, and formation instructions. Shared audio paths live here too. |
| `audio.js` | Web Audio API tones + MP3 playback. Exposes `playCorrectChime()`, `playTryAgainTone()`, `playButtonTap()`, `playCelebrationSequence()`, `playMp3Sequence()`, `playRandomMp3()`. Audio context is lazy-created on first user interaction. |
| `nfc.js` | Optional Web NFC support. Parses tags in `ql:letterId` format. `onTag` callback wired in `app.js`. |
| `app.js` | All game logic, stage transitions, canvas tracing, settings UI, progress tracking, mascot state, NFC integration. |
| `styles.css` | All styling. CSS custom properties at `:root`. No preprocessor. |

## Game Stage Flow

```
home → meet → pick → trace → celebrate → [next letter or complete]
```

- **home**: shows active letters and progress dots; settings gear opens parent settings overlay
- **meet**: Quinnja presents the letter with audio; continue arrow advances
- **pick**: child taps the correct letter from 4 options; wrong taps animate and play tone
- **trace**: canvas drawing with SVG ghost letter guide; hit-mask validation on "Done"
- **celebrate**: sparkle animation; advancing goes to next letter in queue or complete screen
- **complete**: shows all practised letters; replay or home

The global Home button (`#btn-global-home`) is visible during active game stages and shows a confirmation overlay before exiting.

## State Architecture

All runtime state is in `app.js` module-level variables — no global `window` properties. Key state:

- `letterQueue` — shuffled array of letter IDs for the session
- `currentLetterIndex` — pointer into the queue
- `traceAttempts` — count per letter
- `sessionProgress` — map of letterId → `{met, picked, traced}`

**localStorage** is used only for parent settings (child name, active letters, display case, audio toggles, NFC mode). Read on load, written only on Settings save.

## Trace System

The trace canvas is 220×220. Letter strokes are defined in `data.js` as SVG-path-like arrays under each letter's `formation.strokes`. The SVG `#trace-guide` renders animated ghost paths (font-rendered guide letters, not raw SVG paths). Hit detection uses a pixel-sampled hit mask generated from the canvas; tolerance and alignment offsets are tuned per letter.

Key gotcha: the hit mask alignment is letter-specific. If tracing feels broken for one letter, check its `formation` entry in `data.js` before touching canvas or hit-mask code.

## Mascot Positioning

`assets/quinnja.png` is positioned differently in each stage via CSS classes (`mascot-home`, `mascot-meet`, `mascot-pick`, `mascot-trace`, `mascot-celebrate`). These are carefully tuned — any refactor to the mascot wrap/image structure must be visually verified in both desktop and tablet viewports.

## Audio Gotchas

- `AudioContext` requires a user gesture before creation (browser autoplay policy). `audio.js` defers context creation to the first call.
- MP3 files are referenced by relative paths defined in `data.js`. Missing files fail silently (no throw); add `console.warn` if debugging audio issues.
- Settings has separate toggles for speech audio (`setting-audio`) and sound effects (`setting-sound-effects`).

## Adding a New Letter

1. Add an entry to the `LETTERS` array in `data.js` following the existing schema (id, cases, colours, audio paths, formation strokes, ghost paths, start dot).
2. Add the corresponding MP3 files to `assets/`.
3. The letter will automatically appear in the Settings toggle grid and be eligible for sessions.

## Key Constraints

- No frameworks, no build tools — all paths must work as plain relative paths for GitHub Pages.
- Keep game state in-memory only; never write session state to localStorage.
- CSS specificity: check for conflicts before adding new rules — the cascade is not isolated by component.
- Child psychology: use filling progress indicators, not countdown timers; positive reinforcement only.
