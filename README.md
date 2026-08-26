# 無下限 — Gojo Satoru

A three-act scroll cinematic tribute to **Gojo Satoru** (Jujutsu Kaisen).

**Live repo:** https://github.com/sawon2026/gojo-unlimited

```bash
git clone https://github.com/sawon2026/gojo-unlimited.git
cd gojo-unlimited
npm install
npm run dev
```

## The three acts

| # | Section | Interaction |
|---|---------|-------------|
| 01 | **六眼 / SIX EYES** | Sticky stage. Scroll scrubs the energy sequence. |
| 02 | **領域展開 / UNLIMITED VOID** | Domain expansion + glyph rain. |
| 03 | **二つの顔 / THE STRONGEST** | Dual portrait lens reveal. |

## Frames

Add frame sequences here (not committed yet — binary assets):

```
public/frames/awaken/000.webp …
public/frames/awaken-half/…
public/frames/domain/…
public/frames/domain-half/…
public/img/gojo-sealed.webp
public/img/gojo-awakened.webp
```

JSON metadata is already in the repo. Update `count` to match your frames. Prefer 70–80 frames at ~1280×720.

## Deploy

1. Settings → Pages → Source: **GitHub Actions**
2. Push to `main`

React 19 + Vite + pure Canvas 2D.

Fan tribute — rights belong to their holders.
