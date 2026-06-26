/**
 * Portfolio v2 — entry point.
 *
 * Boots the design-system styles and (in later commits) wires up navigation,
 * the smooth-scroll + reveal motion system, and lazily loads the WebGL
 * "system schematic" centerpiece. Kept deliberately small: heavy work is
 * code-split and deferred so first paint stays fast.
 */
import './styles/base.css'

// Mark the document as hydrated so CSS can enable JS-only enhancements.
document.documentElement.classList.add('is-ready')
