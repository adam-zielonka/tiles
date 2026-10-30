# Tiles readability verification — issue #31

- UTC date: 2026-10-30; code commit `662ed7130ac394052fd8c5d0f958384ec34d9d04`.
- The package does not declare a version. These images use the production Vite build of that code commit.
- Chromium 156.0.8078.4, desktop 1280×1000 and phone 390×844 (`isMobile`, `hasTouch`), existing light theme.
- Twelve PNGs: `desktop`/`phone` × `step2`/`step3`/`active-focus` × `color`/`grayscale`. Step 2 shows the error, step 3 preserves ready/scanned progress, active-focus shows a selected filter after blur and a different focused button.

## Method and privacy

The browser intercepts only the built JavaScript response **in memory** and replaces the repository's hard-coded demo material, TO and bin identifiers with synthetic DEMO identifiers. Quantities, state logic, scanning text and the production source/build are unchanged. No real warehouse data, personal paths or history is used. Assets without interception are verified separately when checking publication.

Grayscale images apply `html.style.filter = "grayscale(1)"`. This is a CSS rendering check, not a physical monochrome-panel test or a complete WCAG certification. Screenshots remove text selection, wait two rendering frames and, on touch, tap the noninteractive title before capture. This clears transient browser tap feedback while proving that the active outline persists. No active, focus or tap CSS is overridden. The active-focus images then use actual Tab navigation to an inactive button, keeping selected and focused controls distinct.

## Results

- `pnpm lint`, `pnpm build`, `pnpm audit --audit-level=high`: PASS.
- Actual error paragraph: 16px black on `#e16758`, contrast **6.28:1** color and **5.31:1** after CSS grayscale. Text and SVG share the same font-color variable.
- Selected filter: permanent 2px inset `#111` (17.58:1 against yellow, 18.88:1 against white); keyboard focus: separate 2px dashed `#111` outline with 2px offset. `aria-pressed` matches filter/Highlight state.
- all/0–5 and all six states, tile counts, original values/text/progress, ++/-- wrap, Highlight on/off, active after blur, Tab/Shift+Tab/Enter/Space and touch: PASS.
- Document width equals viewport at 320, 390, 600, 900, 1280 and 1440px; no JS errors.
- No Store, dimensions, System, scanning behavior or data-source changes.

`report.json` contains sanitized structured measurements; `SHA256SUMS` identifies the images. No terminal transcript is included.

## Reproduce

`verify.cjs` is a bounded browser regression harness, not a new project dependency or test framework. Use an already available Playwright installation/Chromium:

```sh
PLAYWRIGHT_MODULE=/path/to/playwright \
CHROMIUM_PATH=/path/to/chrome-headless-shell \
CHROMIUM_LIB_PATH=/optional/existing/library-directory \
ISSUE31_URL=http://127.0.0.1:4198/ \
ISSUE31_OUT=/tmp/tiles-readability-check \
node docs/readability-2026-10-30/verify.cjs
```

For local checks run the existing `pnpm preview --host 127.0.0.1 --port 4198 --strictPort` after `pnpm build`. Set `ISSUE31_URL=https://adam-zielonka.github.io/tiles/` for the deployed check. No fake timers, engine replacement or server mutation is used. Publication and deployed render are separately recorded in issue #31.
