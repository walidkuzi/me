/**
 * Small, GPU-cheap interactions:
 *  - count-up for [data-count] stats when they scroll into view,
 *  - magnetic buttons that drift toward the pointer,
 *  - a subtle parallax tilt on [data-tilt] panels.
 * Pointer effects only run on fine pointers and never under reduced motion.
 */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = window.matchMedia('(pointer: fine)').matches

export function initMicro(): void {
  initCounters()
  if (reduceMotion || !finePointer) return
  initMagnetic()
  initTilt()
}

function initCounters(): void {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'))
  if (!els.length) return

  const run = (el: HTMLElement): void => {
    const target = Number(el.dataset.count ?? '0')
    const suffix = el.dataset.suffix ?? ''
    if (reduceMotion) {
      el.textContent = `${target}${suffix}`
      return
    }
    const duration = 1100
    const start = performance.now()
    const tick = (now: number): void => {
      const p = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      el.textContent = `${Math.round(target * eased)}${suffix}`
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        run(entry.target as HTMLElement)
        obs.unobserve(entry.target)
      }
    },
    { threshold: 0.5 },
  )
  els.forEach((el) => io.observe(el))
}

function initMagnetic(): void {
  document.querySelectorAll<HTMLElement>('.btn').forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect()
      const mx = e.clientX - (r.left + r.width / 2)
      const my = e.clientY - (r.top + r.height / 2)
      btn.style.transform = `translate(${mx * 0.16}px, ${my * 0.26}px)`
    })
    btn.addEventListener('pointerleave', () => {
      btn.style.transform = ''
    })
  })
}

/**
 * Tilt writes --rx/--ry custom properties (composed into a transform by CSS)
 * rather than style.transform, so it can't stomp reveal/perspective styles.
 */
function initTilt(): void {
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      card.style.setProperty('--rx', `${-py * 4}deg`)
      card.style.setProperty('--ry', `${px * 5}deg`)
    })
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--rx')
      card.style.removeProperty('--ry')
    })
  })
}
