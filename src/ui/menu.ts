/**
 * Mobile menu: toggles a `menu-open` class on <html>, manages aria + `inert`
 * (so closed links aren't focusable), closes on link click / Escape / resize
 * to desktop, and locks scroll while open.
 */
export function initMenu(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]')
  const menu = document.querySelector<HTMLElement>('#menu')
  if (!toggle || !menu) return

  // Regions behind the menu — made inert while it's open so focus stays in it.
  const background = [document.getElementById('content'), document.querySelector('footer')]

  const isOpen = () => document.documentElement.classList.contains('menu-open')

  const setOpen = (open: boolean): void => {
    document.documentElement.classList.toggle('menu-open', open)
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    menu.toggleAttribute('inert', !open)
    background.forEach((el) => el?.toggleAttribute('inert', open))
    window.dispatchEvent(new CustomEvent('menu:toggle', { detail: open }))
  }

  setOpen(false)

  toggle.addEventListener('click', () => setOpen(!isOpen()))
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)))

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      setOpen(false)
      toggle.focus()
    }
  })

  window
    .matchMedia('(min-width: 901px)')
    .addEventListener('change', (e) => {
      if (e.matches) setOpen(false)
    })
}
