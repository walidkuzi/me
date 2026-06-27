# Portfolio — Waleed Mohammad Rahim

> **AI Systems Architect & Software Engineer · Founder**
> I architect the infrastructure layer of intelligence.

An animated, 3D personal portfolio built around a custom **"Blueprint / Schematic"**
design system — a draftsman aesthetic of hairline grids, monospace coordinates and a
single signal-teal accent, with an interactive WebGL "system schematic" at its core.

**Live:** [walidkuzi.github.io/me](https://walidkuzi.github.io/me/)

## Highlights

- **Interactive WebGL centerpiece** — a Three.js node-graph (custom glow/depth shaders)
  that reacts to the pointer and scroll, with raycast node labels. Lazily loaded and
  perf-guarded (offscreen/blur pause, adaptive quality), with a static SVG fallback for
  reduced-motion, small screens, Save-Data and no-WebGL.
- **Custom design system** — tokens, typography, layout primitives, ambient blueprint
  background and component atoms, with dark ("ink") and light ("draft paper") themes.
- **Smooth motion** — Lenis smooth scroll + GSAP scroll-reveals, magnetic buttons,
  card tilt and count-up stats. Fully `prefers-reduced-motion` aware.
- **Typst CV** — a one-page résumé matching the site, downloadable from the hero/contact.

## Tech stack

Vite · TypeScript · Three.js · GSAP (ScrollTrigger) · Lenis · self-hosted fonts
(Space Grotesk, JetBrains Mono, Geist) · Typst (CV) · GitHub Actions → Pages.

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
│   ├── main.ts             # bootstrap (nav, theme, scroll, reveals, lazy 3D)
│   ├── styles/             # tokens, base, typography, layout, components, sections/*
│   ├── three/              # scene, nodegraph, shaders, interaction, perf
│   ├── motion/             # lenis, reveal, micro
│   └── ui/                 # nav, theme, menu
├── cv/                     # Typst CV source + vendored fonts
├── public/                 # favicon, og image, CV pdf, robots, sitemap
└── .github/workflows/      # build + deploy to Pages
```

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the Vite app and
publishes `dist/` to GitHub Pages.

> **One-time setup:** in the repo, go to **Settings → Pages → Build and deployment →
> Source** and select **GitHub Actions**.

---

*Designed & built in Istanbul · Blueprint v2 · 2026*
