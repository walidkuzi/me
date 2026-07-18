/**
 * Portfolio v4 — entry point.
 *
 * Boots the design-system styles and wires up navigation, theme, the mobile
 * menu, and the native reveal/tilt motion system. The zero-dependency
 * "system isometric" hero renderer is code-split and lazily mounted so first
 * paint stays fast.
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
import { initReveals } from './motion/reveal'
import { initMicro } from './motion/micro'

/** Lazily load the dimensional schematic, but only when it's worth it. */
function mountSchematic(): void {
  const viz = document.querySelector<HTMLElement>('[data-viz]')
  if (!viz) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData
  const smallTouch = window.matchMedia('(pointer: coarse)').matches && window.innerWidth < 640
  // Keep the static SVG fallback when motion isn't appropriate.
  if (reduceMotion || saveData || smallTouch) return

  const observer = new IntersectionObserver((entries, obs) => {
    if (!entries.some((e) => e.isIntersecting)) return
    obs.disconnect()
    void import('./dimensional').then((m) => m.initDimensional(viz)).catch(() => {})
  })
  observer.observe(viz)
}

function boot(): void {
  initTheme()
  initNav()
  initMenu()
  initReveals()
  initMicro()
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
