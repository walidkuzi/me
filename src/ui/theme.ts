/**
 * Theme toggle. The initial theme is set by an inline script in <head>
 * (before paint) to avoid a flash; this only wires the toggle button and
 * persists the choice. A `themechange` event lets the WebGL scene recolour.
 */
const KEY = 'theme'
type Theme = 'light' | 'dark'

function current(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
}

function apply(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme)
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    'content',
    theme === 'light' ? '#E9ECF1' : '#0B0E14',
  )
  window.dispatchEvent(new CustomEvent<Theme>('themechange', { detail: theme }))
}

export function initTheme(): void {
  const btn = document.querySelector<HTMLButtonElement>('[data-theme-toggle]')
  btn?.addEventListener('click', () => {
    const next: Theme = current() === 'light' ? 'dark' : 'light'
    apply(next)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* private mode — ignore */
    }
  })
}
