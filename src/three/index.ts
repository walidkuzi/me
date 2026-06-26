import * as THREE from 'three'
import { createStage } from './scene'

/**
 * Entry point for the hero "system schematic". Lazily imported by main.ts only
 * when the panel is in view and motion/WebGL are permitted. This first cut
 * boots the stage with a placeholder wireframe; the node-graph, shaders and
 * interaction land in following commits.
 */
export async function initSchematic(mount: HTMLElement): Promise<void> {
  const stage = createStage(mount)

  const placeholder = new THREE.Mesh(
    new THREE.IcosahedronGeometry(2.1, 1),
    new THREE.MeshBasicMaterial({ color: 0x34e5c8, wireframe: true, transparent: true, opacity: 0.45 }),
  )
  stage.scene.add(placeholder)

  stage.onFrame((dt) => {
    placeholder.rotation.y += dt * 0.22
    placeholder.rotation.x += dt * 0.09
  })

  stage.start()
  document.documentElement.classList.add('webgl-on')
}
