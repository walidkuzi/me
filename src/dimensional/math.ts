/**
 * Minimal 3D helpers for the dimensional scene: rotate model-space vectors,
 * then perspective-project into canvas pixels. No matrices — the scene only
 * ever needs yaw/pitch/bank plus a fixed camera on the +Z axis.
 */

export type V3 = [number, number, number]

/** Camera distance from the origin along +Z (model units). */
export const CAM_Z = 5

export function rotX(v: V3, a: number): V3 {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return [v[0], v[1] * c - v[2] * s, v[1] * s + v[2] * c]
}

export function rotY(v: V3, a: number): V3 {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return [v[0] * c + v[2] * s, v[1], -v[0] * s + v[2] * c]
}

export function rotZ(v: V3, a: number): V3 {
  const c = Math.cos(a)
  const s = Math.sin(a)
  return [v[0] * c - v[1] * s, v[0] * s + v[1] * c, v[2]]
}

/**
 * Project a rotated model-space point. Returns screen x/y plus camera-space
 * depth (CAM_Z at the origin; larger = farther from the viewer).
 */
export function project(v: V3, w: number, h: number, focal: number): V3 {
  const depth = CAM_Z - v[2]
  const s = focal / depth
  return [w / 2 + v[0] * s, h / 2 - v[1] * s, depth]
}
