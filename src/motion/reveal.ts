/**
 * Scroll-reveal for [data-reveal] elements: an IntersectionObserver hands each
 * newly-visible batch a small stagger (via --reveal-delay) and CSS transitions
 * opacity + translate. The `translate` property is used instead of `transform`
 * so the transform channel stays free for tilt/perspective effects.
 * Under reduced motion everything is simply shown. Elements are pre-hidden via
 * CSS (.has-js) to avoid a flash before JS runs.
 */
export function initReveals(): void {
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
  if (!items.length) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((el) => el.classList.add('is-revealed'))
    return
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      entries
        .filter((entry) => entry.isIntersecting)
        .forEach((entry, i) => {
          const el = entry.target as HTMLElement
          el.style.setProperty('--reveal-delay', `${i * 70}ms`)
          el.classList.add('is-revealed')
          obs.unobserve(el)
        })
    },
    { rootMargin: '0px 0px -12% 0px' },
  )

  items.forEach((el) => io.observe(el))
}
