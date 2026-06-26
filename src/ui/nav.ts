/**
 * Navigation behaviour: scroll-progress rail, a "scrolled" state for the bar,
 * and active-section highlighting via IntersectionObserver. Reads native
 * scroll position (Lenis scrolls natively), so it stays decoupled from motion.
 */
export function initNav(): void {
  const nav = document.querySelector<HTMLElement>('[data-nav]')
  const progress = document.querySelector<HTMLElement>('[data-progress]')
  const links = Array.from(
    document.querySelectorAll<HTMLAnchorElement>('.nav__links a, .menu__list a'),
  )

  let ticking = false
  const update = () => {
    ticking = false
    const doc = document.documentElement
    const max = doc.scrollHeight - doc.clientHeight
    const p = max > 0 ? Math.min(1, doc.scrollTop / max) : 0
    if (progress) progress.style.transform = `scaleX(${p})`
    nav?.classList.toggle('nav--scrolled', doc.scrollTop > 8)
  }
  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(update)
  }
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })

  // Map href targets → links so both desktop and mobile stay in sync.
  const byId = new Map<string, HTMLAnchorElement[]>()
  for (const a of links) {
    const id = a.getAttribute('href')?.slice(1)
    if (id) byId.set(id, [...(byId.get(id) ?? []), a])
  }

  const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'))
  if (sections.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          links.forEach((l) => {
            l.classList.remove('is-active')
            l.removeAttribute('aria-current')
          })
          byId.get(entry.target.id)?.forEach((l) => {
            l.classList.add('is-active')
            l.setAttribute('aria-current', 'true')
          })
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
  }
}
