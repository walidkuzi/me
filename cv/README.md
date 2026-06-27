# CV (Typst)

`cv.typ` is the single source for the PDF résumé, styled to match the site's
"Blueprint" system (Space Grotesk + JetBrains Mono, hairline rules, teal accent).

## Build

From the repo root:

```bash
npm run cv
```

which runs:

```bash
typst compile --font-path cv/fonts cv/cv.typ public/Waleed-Rahim-CV.pdf
```

The output lands in `public/` so Vite ships it and the site's **Download CV**
buttons (`/me/Waleed-Rahim-CV.pdf`) resolve in production.

## Fonts

`cv/fonts/` holds static OFL instances of Space Grotesk and JetBrains Mono
(Regular/Medium/Bold), instanced from the variable originals because Typst 0.14
does not yet support variable fonts. They're vendored so the build is
reproducible without installing system fonts.

## Requirements

- [Typst](https://typst.app) ≥ 0.13 (`brew install typst`)
