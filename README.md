# 無下限 — Gojo Satoru

A three-act scroll cinematic tribute to **Gojo Satoru** (Jujutsu Kaisen), built with the same architecture as the Solo Leveling interactive experience.

```bash
npm install
npm run dev
npm run build
```

## The three acts

| # | Section | Interaction |
|---|---------|-------------|
| 01 | **六眼 / SIX EYES** | Sticky stage. Scroll scrubs an energy sequence: void → core glow → Six Eyes open. |
| 02 | **領域展開 / UNLIMITED VOID** | Domain expansion sequence. Glyph rain + progressive void. |
| 03 | **二つの顔 / THE STRONGEST** | Dual portrait. Pointer / touch lens reveals the awakened form. |

A storm (`Thunder`) runs over all sections and respects `prefers-reduced-motion`.

## Notes

- Frame sequences are **abstract original energy art** (not official character artwork) so the project stays clean for a public fan tribute.
- Replace `public/frames/awaken/` and `public/frames/domain/` with higher-fidelity sequences (70–80 frames at ~1280×720) when you have them. Keep the same JSON metadata and zero-padded naming.
- Built with React 19 + Vite + pure Canvas 2D.

## Deploy

Pushed to `main` → GitHub Actions builds and publishes to GitHub Pages.

Fan tribute — Jujutsu Kaisen characters and names belong to their respective rights holders.
