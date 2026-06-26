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

function boot(): void {
  initTheme()
  initNav()
  initMenu()

  const year = document.querySelector('[data-year]')
  if (year) year.textContent = String(new Date().getFullYear())

  document.documentElement.classList.add('is-ready')
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot)
} else {
  boot()
}
