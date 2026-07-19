/**
 * Mounts the dimensional hero scene: a zero-dependency Canvas-2D renderer
 * replacing the old Three.js chunk (527 KB → a few KB). Owns the rAF loop and
 * every perf guard: DPR cap, off-screen + hidden-tab pause, and an adaptive
 * quality step-down (lower DPR, then alternate frames) if frames run long.
 */
import { buildSprites, readPalette, render, type SceneState } from './draw'
import { buildScene } from './scene'

export function initDimensional(host: HTMLElement): void {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  host.appendChild(canvas)
  host.classList.add('viz-on')

  const scene = buildScene()
  let palette = readPalette()
  let sprites = buildSprites(palette)

  const state: SceneState = {
    yaw: -0.6,
    yawOff: 0,
    pitchOff: 0,
    targetYawOff: 0,
    targetPitchOff: 0,
    pulses: [],
    spawnIn: 600,
  }

  // ---- sizing ----
  let w = 0
  let h = 0
  let dprCap = 2
  const resize = (): void => {
    w = host.clientWidth
    h = host.clientHeight
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap)
    canvas.width = Math.round(w * dpr)
    canvas.height = Math.round(h * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()
  new ResizeObserver(resize).observe(host)

  // ---- pointer parallax ----
  host.addEventListener('pointermove', (e) => {
    const r = host.getBoundingClientRect()
    state.targetYawOff = ((e.clientX - r.left) / r.width - 0.5) * 0.7
    state.targetPitchOff = ((e.clientY - r.top) / r.height - 0.5) * 0.45
  })
  host.addEventListener('pointerleave', () => {
    state.targetYawOff = 0
    state.targetPitchOff = 0
  })

  // ---- theme reactivity ----
  window.addEventListener('themechange', () => {
    palette = readPalette()
    sprites = buildSprites(palette)
  })

  // ---- adaptive quality ----
  let avg = 16
  let skip = false
  let frame = 0

  // ---- rAF loop with off-screen / hidden-tab pause ----
  let running = false
  let rafId = 0
  let last = 0
  const tick = (): void => {
    rafId = requestAnimationFrame(tick)
    const now = performance.now()
    frame++
    if (skip && frame % 2 === 1) return
    const dt = Math.min(80, now - last)
    last = now

    if (!skip) {
      avg += (dt - avg) * 0.05
      if (avg > 24) {
        if (dprCap > 1) {
          dprCap = 1
          resize()
          avg = 16
        } else {
          skip = true
        }
      }
    }

    render(ctx, scene, state, palette, sprites, w, h, dt)
  }

  let onScreen = false
  const setRunning = (on: boolean): void => {
    if (on === running) return
    running = on
    if (on) {
      last = performance.now()
      rafId = requestAnimationFrame(tick)
    } else {
      cancelAnimationFrame(rafId)
    }
  }

  new IntersectionObserver((entries) => {
    onScreen = entries.some((e) => e.isIntersecting)
    setRunning(onScreen && !document.hidden)
  }).observe(host)
  document.addEventListener('visibilitychange', () => {
    setRunning(onScreen && !document.hidden)
  })
}
