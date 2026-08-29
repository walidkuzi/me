# Portfolio — Waleed Mohammad Rahim

> **AI Systems Architect & Software Engineer · Founder**
> I architect the infrastructure layer of intelligence.

A dimensional, 3D-feeling personal portfolio built on the **"Blueprint Dimensional"**
design system — a draftsman aesthetic of hairline grids, monospace coordinates and a
single signal-teal accent, extended into real depth: stacked glass panels with lit
edges, receding grid floors, and a zero-dependency 3D "system isometric" at its core.

**Live:** [walidkuzi.github.io/me](https://walidkuzi.github.io/me/)

## Highlights

- **Zero-dependency 3D centerpiece** — a hand-written Canvas-2D perspective renderer
  (~5 KB, no Three.js): an icosahedron core with orbiting satellites, depth fog,
  glow sprites and signal pulses. Reacts to the pointer, recolors with the theme,
  and is perf-guarded (offscreen/hidden pause, DPR cap, adaptive quality), with a
  static SVG fallback for reduced-motion, small screens and Save-Data.
- **Dimensional design system** — glass panels with gradient lit edges, layered
  elevation shadows, perspective tilt stages and intra-card parallax, on top of the
  blueprint tokens. Dark ("ink") and light ("draft paper") themes.
- **Native motion, no libraries** — IntersectionObserver scroll-reveals on the
  `translate` channel, CSS smooth scrolling, scroll-driven extras behind
  `@supports (animation-timeline: view())`, magnetic buttons, tilt and count-up
  stats. Fully `prefers-reduced-motion` aware.
- **Featherweight** — total JavaScript ≈ 12 KB minified (≈ 5 KB gzipped), down from
  666 KB in v2/v3. No runtime dependencies beyond self-hosted fonts.
- **Typst CV** — a one-page résumé matching the site, downloadable from the hero/contact.

## Tech stack

Vite · TypeScript · hand-rolled Canvas 3D · self-hosted fonts (Space Grotesk,
JetBrains Mono, Geist) · Typst (CV) · GitHub Actions → Pages.

## Local development

```bash
npm install
npm run dev        # start Vite dev server
npm run build      # type-check + production build → dist/
npm run preview    # preview the production build
npm run cv         # rebuild the PDF CV → public/Waleed-Rahim-CV.pdf (needs `typst`)
```

## Project structure

```text
.
├── index.html              # semantic markup, progressively enhanced
├── vite.config.ts          # base: '/me/'
├── src/
│   ├── main.ts             # bootstrap (nav, theme, reveals, lazy 3D)
│   ├── styles/             # tokens, base, dimensional, components, sections/*
│   ├── dimensional/        # math, scene, draw, mount — the micro-3D renderer
│   ├── motion/             # reveal, micro
│   └── ui/                 # nav, theme, menu
├── cv/                     # Typst CV source + vendored fonts
├── docs/                   # research + working notes — NOT part of the build
├── public/                 # favicon, og image, CV pdf, robots, sitemap
└── .github/workflows/      # build + deploy to Pages
```

> **`docs/` never reaches the site.** Vite's only inputs are `index.html`, `src/` and
> `public/`, so markdown under `docs/` is not bundled, routed, linked or indexed — it is
> repository-only material. See [`docs/README.md`](docs/README.md).

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the Vite app and
publishes `dist/` to GitHub Pages.

> **One-time setup:** in the repo, go to **Settings → Pages → Build and deployment →
> Source** and select **GitHub Actions**.

---

*Designed & built in Istanbul · Blueprint Dimensional · v4 · 2026*
