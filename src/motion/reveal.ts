import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scroll-reveal for [data-reveal] elements: a batched fade/translate-up with a
 * small stagger so groups (cards, rows) draw in together. Lenis drives
 * ScrollTrigger updates. Under reduced motion everything is simply shown.
 * Elements are pre-hidden via CSS (.has-js) to avoid a flash before JS runs.
 */
export function initReveals(lenis: Lenis | null): void {
  const items = gsap.utils.toArray<HTMLElement>('[data-reveal]')
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduce || !items.length) {
    items.forEach((el) => el.classList.add('is-revealed'))
    return
  }

  if (lenis) lenis.on('scroll', () => ScrollTrigger.update())

  ScrollTrigger.batch(items, {
    start: 'top 86%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.07,
        overwrite: true,
        onComplete: () => batch.forEach((el) => (el as HTMLElement).classList.add('is-revealed')),
      }),
  })

  ScrollTrigger.refresh()
}
