/**
 * Frame rendering: rotate + project the scene, depth-sort, stroke edges with
 * depth fog, draw glow-sprite nodes, and run signal pulses along the link
 * edges. Glow comes from layered strokes and pre-rendered radial sprites —
 * never ctx.shadowBlur (slow). In dark theme strokes composite additively.
 */
import type { V3 } from './math'
import { CAM_Z, project, rotX, rotY } from './math'
import type { Scene } from './scene'
import { CORE, LINK, ORBIT } from './scene'

export interface Palette {
  accent: string
  accentRgb: string
  accent2: string
  accent2Rgb: string
  line: string
  faint: string
  dark: boolean
}

export interface Sprites {
  core: HTMLCanvasElement
  sat: HTMLCanvasElement
  pulse: HTMLCanvasElement
  aura: HTMLCanvasElement
}

export interface Pulse {
  edge: number
  t: number
}

export interface SceneState {
  yaw: number
  yawOff: number
  pitchOff: number
  targetYawOff: number
  targetPitchOff: number
  pulses: Pulse[]
  spawnIn: number
}

const BASE_PITCH = 0.18
const ROT_PER_MS = 0.00011

function hexToRgb(hex: string): string {
  const n = parseInt(hex.replace('#', ''), 16)
  if (hex.length !== 7 || Number.isNaN(n)) return '52, 229, 200'
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
}

/** Colors come from the live design tokens so the theme toggle recolors us. */
export function readPalette(): Palette {
  const cs = getComputedStyle(document.documentElement)
  const token = (name: string, fallback: string): string => cs.getPropertyValue(name).trim() || fallback
  const accent = token('--accent', '#34e5c8')
  const accent2 = token('--accent-2', '#6ea8ff')
  return {
    accent,
    accentRgb: hexToRgb(accent),
    accent2,
    accent2Rgb: hexToRgb(accent2),
    line: token('--line-strong', '#2b3a4f'),
    faint: token('--text-faint', '#7a8898'),
    dark: document.documentElement.dataset.theme !== 'light',
  }
}

function glowSprite(size: number, rgb: string, coreAlpha: number, midAlpha: number, coreStop: number): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  if (!g) return c
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, `rgba(${rgb}, ${coreAlpha})`)
  grad.addColorStop(coreStop, `rgba(${rgb}, ${midAlpha})`)
  grad.addColorStop(1, `rgba(${rgb}, 0)`)
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  return c
}

export function buildSprites(p: Palette): Sprites {
  return {
    core: glowSprite(64, p.accentRgb, 0.95, 0.26, 0.18),
    sat: glowSprite(64, p.accent2Rgb, 0.9, 0.22, 0.16),
    pulse: glowSprite(64, p.accentRgb, 1, 0.32, 0.2),
    aura: glowSprite(256, p.accentRgb, p.dark ? 0.3 : 0.14, 0.06, 0.1),
  }
}

function stroke(ctx: CanvasRenderingContext2D, a: V3, b: V3, color: string, width: number, alpha: number): void {
  ctx.globalAlpha = alpha
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  ctx.moveTo(a[0], a[1])
  ctx.lineTo(b[0], b[1])
  ctx.stroke()
}

/** Depth fog: full strength up close, fading to 25% at the far edge. */
function fogAt(z: number): number {
  const t = Math.min(1, Math.max(0, (z - (CAM_Z - 2.5)) / 5))
  return 1 - 0.75 * t
}

export function render(
  ctx: CanvasRenderingContext2D,
  scene: Scene,
  st: SceneState,
  pal: Palette,
  spr: Sprites,
  w: number,
  h: number,
  dt: number,
): void {
  st.yaw += ROT_PER_MS * dt
  const k = Math.min(1, dt * 0.0045)
  st.yawOff += (st.targetYawOff - st.yawOff) * k
  st.pitchOff += (st.targetPitchOff - st.pitchOff) * k

  const yaw = st.yaw + st.yawOff
  const pitch = BASE_PITCH + st.pitchOff
  const focal = 1.1 * Math.min(w, h)

  ctx.clearRect(0, 0, w, h)

  // Ambient aura behind the core.
  const auraS = (focal / CAM_Z) * 2.6
  ctx.globalAlpha = 1
  ctx.globalCompositeOperation = 'source-over'
  ctx.drawImage(spr.aura, w / 2 - auraS / 2, h / 2 - auraS / 2, auraS, auraS)

  // Additive strokes read as light in the dark theme; plain ink on paper.
  ctx.globalCompositeOperation = pal.dark ? 'lighter' : 'source-over'

  const pts = scene.verts.map((v) => project(rotX(rotY(v, yaw), pitch), w, h, focal))

  // Far → near so near edges overdraw far ones.
  const order = scene.edges.map((_, i) => i)
  const depthOf = (i: number): number => (pts[scene.edges[i].a][2] + pts[scene.edges[i].b][2]) / 2
  order.sort((i, j) => depthOf(j) - depthOf(i))

  for (const i of order) {
    const e = scene.edges[i]
    const a = pts[e.a]
    const b = pts[e.b]
    const f = fogAt((a[2] + b[2]) / 2)
    if (e.kind === CORE) {
      stroke(ctx, a, b, pal.accent, 3.5, 0.1 * f)
      stroke(ctx, a, b, pal.accent, 1.25, 0.8 * f)
    } else if (e.kind === ORBIT) {
      stroke(ctx, a, b, pal.accent2, 1, 0.3 * f)
    } else if (e.kind === LINK) {
      stroke(ctx, a, b, pal.faint, 1, 0.35 * f)
    } else {
      stroke(ctx, a, b, pal.line, 1, 0.4 * f)
    }
  }

  // Nodes: core vertices bright, satellites in the secondary accent.
  for (let i = 0; i < scene.nodeEnd; i++) {
    const p = pts[i]
    const s = (i < scene.coreEnd ? 0.26 : 0.34) * (focal / p[2])
    ctx.globalAlpha = fogAt(p[2])
    ctx.drawImage(i < scene.coreEnd ? spr.core : spr.sat, p[0] - s / 2, p[1] - s / 2, s, s)
  }

  // Signal pulses: bright dots travelling satellite → core along link edges.
  st.spawnIn -= dt
  if (st.spawnIn <= 0 && scene.links.length) {
    st.spawnIn = 1400 + Math.random() * 900
    st.pulses.push({ edge: scene.links[(Math.random() * scene.links.length) | 0], t: 0 })
  }
  st.pulses = st.pulses.filter((p) => (p.t += dt / 900) < 1)
  for (const pu of st.pulses) {
    const e = scene.edges[pu.edge]
    const a = pts[e.a]
    const b = pts[e.b]
    const t = pu.t * pu.t * (3 - 2 * pu.t)
    const x = a[0] + (b[0] - a[0]) * t
    const y = a[1] + (b[1] - a[1]) * t
    const z = a[2] + (b[2] - a[2]) * t
    const s = 0.2 * (focal / z)
    ctx.globalAlpha = Math.min(1, 0.2 + 4 * pu.t * (1 - pu.t)) * fogAt(z)
    ctx.drawImage(spr.pulse, x - s / 2, y - s / 2, s, s)
  }

  ctx.globalAlpha = 1
  ctx.globalCompositeOperation = 'source-over'
}
