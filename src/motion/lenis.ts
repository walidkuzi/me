import Lenis from 'lenis'

/**
 * Smooth scrolling via Lenis. Scrolls natively (so window scroll listeners and
 * the nav progress keep working), upgrades in-page anchor links to eased
 * scroll-to with a nav-height offset, and pauses while the mobile menu is open.
 * Disabled entirely under prefers-reduced-motion.
 */
export function initSmoothScroll(): Lenis | null {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })

  const raf = (time: number): void => {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)

  const navH = document.querySelector<HTMLElement>('[data-nav]')?.offsetHeight ?? 72

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const hash = a.getAttribute('href')
      if (!hash || hash === '#') return
      const target = document.querySelector<HTMLElement>(hash)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: -navH - 8 })
    })
  })

  // Lock smooth scroll while the mobile menu is open.
  window.addEventListener('menu:toggle', (e) => {
    const open = (e as CustomEvent<boolean>).detail
    if (open) lenis.stop()
    else lenis.start()
  })

  return lenis
}
