# Documentation

> Working notes and research that live in the repository but **never reach the website.**

This directory is a workspace for research, planning notes and reference material. It is
source material for the person maintaining this repo — not site content.

## Nothing in here is published

The site is a Vite single-page app. Its build (`npm run build` → `tsc --noEmit && vite build`)
has exactly three inputs:

- `index.html` — the single HTML entry point
- `src/` — everything reachable from `src/main.ts` via an import
- `public/` — copied verbatim into `dist/`

`docs/` is none of those, so **nothing here is bundled, routed, linked or indexed.**
There is no static site generator, no file-based routing, no content collection and no
`import.meta.glob` anywhere in `vite.config.ts` or `src/` — nothing enumerates markdown at
build time. `public/.nojekyll` additionally stops GitHub Pages from rendering markdown, and
Pages is served from the Actions build artifact rather than from the repo tree, so files
here are never exposed as URLs.

The practical effect: content in `docs/` is visible to anyone browsing the GitHub
repository, and invisible on <https://walidkuzi.github.io/me/>.

> **The one rule:** never move this material into `public/`. That directory *is* copied
> into `dist/` verbatim, and a markdown file placed there would be fetchable as a raw URL.

To deliberately surface something here on the site you would have to hand-author the
markup in `index.html`, add entries to *both* nav blocks, add a section stylesheet under
`src/styles/sections/`, and hand-edit `public/sitemap.xml`. Nothing happens by accident.

## Contents

| Path | What it is |
|---|---|
| `research/leap/` | Field dossier for LEAP 2026, Riyadh · 31 Aug – 3 Sep 2026 |

---

*Structural precedent: `cv/` — source material with its own scoped README, outside the bundle.*
