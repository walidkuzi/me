/**
 * Portfolio v2 — entry point.
 *
 * Boots the design-system styles and wires up navigation, theme, and the
 * mobile menu. The smooth-scroll + reveal motion system and the lazily-loaded
 * WebGL "system schematic" centerpiece are added in later commits. Kept small:
 * heavy work is code-split and deferred so first paint stays fast.
 */

// Self-hosted fonts (subset by unicode-range; only used ranges download).
import '@fontsource-variable/space-grotesk/index.css'
import '@fontsource-variable/jetbrains-mono/index.css'
import '@fontsource/geist-sans/400.css'
import '@fontsource/geist-sans/500.css'
import '@fontsource/geist-sans/600.css'

import './styles/index.css'

import { initTheme } from './ui/theme'
import { initNav } from './ui/nav'
import { initMenu } from './ui/menu'
import { initSmoothScroll } from './motion/lenis'
import { initReveals } from './motion/reveal'

function webglSupported(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')))
  } catch {
    return false
  }
}

/** Lazily load the WebGL schematic, but only when it's worth it. */
function mountSchematic(): void {
  const viz = document.querySelector<HTMLElement>('[data-viz]')
  if (!viz) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
  const smallTouch = window.matchMedia('(pointer: coarse)').matches && window.innerWidth < 640
  // Keep the static SVG fallback when motion/WebGL aren't appropriate.
  if (reduceMotion || saveData || smallTouch || !webglSupported()) return

  const observer = new IntersectionObserver((entries, obs) => {
    if (!entries.some((e) => e.isIntersecting)) return
    obs.disconnect()
    void import('./three').then((m) => m.initSchematic(viz)).catch(() => {})
  })
  observer.observe(viz)
}

function boot(): void {
  initTheme()
  initNav()
  initMenu()
  const lenis = initSmoothScroll()
  initReveals(lenis)
  mountSchematic()

  const year = document.querySelector('[data-year]')
  if (year) year.textContent = String(new Date().getFullYear())

  document.documentElement.classList.add('is-ready')
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot)
} else {
  boot()
}
