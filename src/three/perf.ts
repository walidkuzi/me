import type { Stage } from './scene'

/**
 * Keeps the scene cheap and considerate:
 *  - pauses the render loop when the tab is hidden or the panel scrolls
 *    offscreen (no wasted frames / battery),
 *  - watches the frame rate and, if it stays low, drops the device-pixel-ratio
 *    cap to 1 once as a graceful degrade.
 */
export interface PerfHandle {
  dispose(): void
}

export function attachPerf(stage: Stage, onDegrade?: () => void): PerfHandle {
  let onScreen = true

  const resume = (): void => {
    if (onScreen && !document.hidden) stage.start()
  }

  const onVisibility = (): void => {
    if (document.hidden) stage.stop()
    else resume()
  }
  document.addEventListener('visibilitychange', onVisibility)

  const io = new IntersectionObserver(
    ([entry]) => {
      onScreen = entry.isIntersecting
      if (onScreen) resume()
      else stage.stop()
    },
    { threshold: 0.01 },
  )
  io.observe(stage.mount)

  // FPS watchdog — sample once per second, degrade once if sustained low.
  let frames = 0
  let acc = 0
  let degraded = false
  stage.onFrame((dt) => {
    acc += dt
    frames += 1
    if (acc >= 1) {
      const fps = frames / acc
      frames = 0
      acc = 0
      if (!degraded && fps < 42) {
        degraded = true
        stage.setPixelRatioCap(1)
        onDegrade?.()
      }
    }
  })

  return {
    dispose() {
      document.removeEventListener('visibilitychange', onVisibility)
      io.disconnect()
    },
  }
}
