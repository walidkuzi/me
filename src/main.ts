/**
 * Portfolio v2 — entry point.
 *
 * Boots the design-system styles and (in later commits) wires up navigation,
 * the smooth-scroll + reveal motion system, and lazily loads the WebGL
 * "system schematic" centerpiece. Kept deliberately small: heavy work is
 * code-split and deferred so first paint stays fast.
 */
// Self-hosted fonts (subset by unicode-range; only used ranges download).
import '@fontsource-variable/space-grotesk/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
import '@fontsource/geist-sans/400.css'
import '@fontsource/geist-sans/500.css'
import '@fontsource/geist-sans/600.css'

import './styles/index.css'

// Mark the document as hydrated so CSS can enable JS-only enhancements.
document.documentElement.classList.add('is-ready')
