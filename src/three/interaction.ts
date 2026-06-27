import * as THREE from 'three'
import type { Stage } from './scene'
import type { NodeGraph } from './nodegraph'

/**
 * Pointer + scroll interaction for the schematic:
 *  - camera eases toward the pointer for parallax (doesn't fight the spin),
 *  - scrolling past the hero gently dollies the camera back,
 *  - raycasting against the points highlights the nearest node and floats a
 *    mono label over it.
 * Raycasting is throttled to every few frames to stay cheap.
 */
export interface Interaction {
  update(dt: number): void
  dispose(): void
}

const NODE_TYPES = ['orchestrator', 'service', 'retrieval', 'agent', 'tool']

export function createInteraction(stage: Stage, graph: NodeGraph, label: HTMLElement): Interaction {
  const { mount, camera } = stage
  const target = new THREE.Vector2(0, 0)
  const pointer = new THREE.Vector2(-2, -2)
  let hasPointer = false

  const raycaster = new THREE.Raycaster()
  raycaster.params.Points = { threshold: 0.16 }

  const onMove = (e: PointerEvent): void => {
    const r = mount.getBoundingClientRect()
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1
    const ny = -(((e.clientY - r.top) / r.height) * 2 - 1)
    pointer.set(nx, ny)
    target.set(nx, ny)
    hasPointer = true
  }
  const onLeave = (): void => {
    hasPointer = false
    pointer.set(-2, -2)
    target.set(0, 0)
    setHighlight(-1)
  }

  mount.addEventListener('pointermove', onMove)
  mount.addEventListener('pointerleave', onLeave)

  let current = -1
  const setHighlight = (i: number): void => {
    if (i === current) return
    current = i
    graph.uniforms.uHighlight.value = i
    if (i < 0) {
      label.classList.remove('is-on')
      return
    }
    const type = i === 0 ? NODE_TYPES[0] : NODE_TYPES[1 + (i % (NODE_TYPES.length - 1))]
    label.textContent = `node_${String(i).padStart(2, '0')} · ${type}`
    label.classList.add('is-on')
  }

  const posAttr = graph.points.geometry.getAttribute('position') as THREE.BufferAttribute
  const v = new THREE.Vector3()
  const positionLabel = (i: number): void => {
    v.fromBufferAttribute(posAttr, i).applyMatrix4(graph.points.matrixWorld).project(camera)
    const r = mount.getBoundingClientRect()
    const x = (v.x * 0.5 + 0.5) * r.width
    const y = (-v.y * 0.5 + 0.5) * r.height
    label.style.transform = `translate(${x}px, ${y}px)`
  }

  let frame = 0
  const clamp = (n: number, lo: number, hi: number): number => Math.max(lo, Math.min(hi, n))

  return {
    update(dt) {
      const ease = clamp(dt * 4, 0, 1)
      const scrollProgress = clamp(window.scrollY / Math.max(window.innerHeight, 1), 0, 1)

      camera.position.x += (target.x * 0.9 - camera.position.x) * ease
      camera.position.y += (target.y * 0.6 - camera.position.y) * ease
      const targetZ = 7.4 + scrollProgress * 1.5
      camera.position.z += (targetZ - camera.position.z) * ease
      camera.lookAt(0, 0, 0)

      // Throttle raycasting; keep matrices fresh first.
      if (hasPointer && frame++ % 3 === 0) {
        graph.points.updateWorldMatrix(true, false)
        raycaster.setFromCamera(pointer, camera)
        const hit = raycaster.intersectObject(graph.points, false)[0]
        setHighlight(hit?.index ?? -1)
      }
      if (current >= 0) positionLabel(current)
    },
    dispose() {
      mount.removeEventListener('pointermove', onMove)
      mount.removeEventListener('pointerleave', onLeave)
    },
  }
}
