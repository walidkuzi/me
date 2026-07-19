/**
 * Scene geometry for the hero "system isometric": an icosahedron core (the
 * model), two tilted orbit rings of satellite services linked into it, and a
 * wireframe substrate grid beneath. Built once; draw.ts only rotates and
 * projects. Node/edge counts surface in the hero foot bar (VERTS·26 EDGES·58,
 * substrate excluded) — keep those labels in sync if the geometry changes.
 */
import type { V3 } from './math'
import { rotX, rotZ } from './math'

export const CORE = 0
export const ORBIT = 1
export const LINK = 2
export const FLOOR = 3
export type EdgeKind = typeof CORE | typeof ORBIT | typeof LINK | typeof FLOOR

export interface Edge {
  a: number
  b: number
  kind: EdgeKind
}

export interface Scene {
  verts: V3[]
  edges: Edge[]
  /** verts[0..coreEnd) are icosahedron vertices (primary nodes) */
  coreEnd: number
  /** verts[coreEnd..nodeEnd) are orbit satellites (secondary nodes) */
  nodeEnd: number
  /** indices into `edges` of LINK edges — the signal-pulse carriers */
  links: number[]
}

const PHI = (1 + Math.sqrt(5)) / 2

function dist2(p: V3, q: V3): number {
  return (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2
}

/** Unit-radius icosahedron: 12 vertices, edges = all minimal-distance pairs. */
function icosahedron(): { verts: V3[]; edges: Edge[] } {
  const raw: V3[] = []
  for (const a of [-1, 1]) {
    for (const b of [-PHI, PHI]) {
      raw.push([0, a, b], [a, b, 0], [b, 0, a])
    }
  }
  const r = Math.hypot(1, PHI)
  const verts = raw.map((v): V3 => [v[0] / r, v[1] / r, v[2] / r])

  let min = Infinity
  for (let i = 0; i < verts.length; i++)
    for (let j = i + 1; j < verts.length; j++) min = Math.min(min, dist2(verts[i], verts[j]))

  const edges: Edge[] = []
  for (let i = 0; i < verts.length; i++)
    for (let j = i + 1; j < verts.length; j++)
      if (dist2(verts[i], verts[j]) < min * 1.02) edges.push({ a: i, b: j, kind: CORE })

  return { verts, edges }
}

function ring(radius: number, count: number, tiltX: number, bankZ: number, phase: number): V3[] {
  const pts: V3[] = []
  for (let i = 0; i < count; i++) {
    const t = phase + (i / count) * Math.PI * 2
    pts.push(rotZ(rotX([radius * Math.cos(t), 0, radius * Math.sin(t)], tiltX), bankZ))
  }
  return pts
}

export function buildScene(): Scene {
  const ico = icosahedron()
  const verts = [...ico.verts]
  const edges = [...ico.edges]
  const coreEnd = verts.length
  const links: number[] = []

  // Each satellite gets an orbit-path segment plus a link to its nearest
  // core vertex (the pulse route into the model).
  const addRing = (pts: V3[]): void => {
    const start = verts.length
    verts.push(...pts)
    for (let i = 0; i < pts.length; i++) {
      edges.push({ a: start + i, b: start + ((i + 1) % pts.length), kind: ORBIT })
      let best = 0
      let bd = Infinity
      for (let j = 0; j < coreEnd; j++) {
        const d = dist2(pts[i], verts[j])
        if (d < bd) {
          bd = d
          best = j
        }
      }
      links.push(edges.length)
      edges.push({ a: start + i, b: best, kind: LINK })
    }
  }
  addRing(ring(1.55, 8, 0.42, 0.1, 0))
  addRing(ring(1.85, 6, -0.52, 0.38, 0.7))
  const nodeEnd = verts.length

  // Substrate grid: a wireframe plane beneath the core.
  const H = 1.8
  const Y = -1.55
  for (let p = -H; p <= H + 1e-6; p += 0.6) {
    const n = verts.length
    verts.push([p, Y, -H], [p, Y, H], [-H, Y, p], [H, Y, p])
    edges.push({ a: n, b: n + 1, kind: FLOOR }, { a: n + 2, b: n + 3, kind: FLOOR })
  }

  return { verts, edges, coreEnd, nodeEnd, links }
}
