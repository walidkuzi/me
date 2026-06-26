import { createStage } from './scene'
import { buildNodeGraph } from './nodegraph'
import { createInteraction } from './interaction'

/**
 * Entry point for the hero "system schematic". Lazily imported by main.ts only
 * when the panel is in view and motion/WebGL are permitted. Builds the
 * node-graph, slowly rotates it, and reports its real node/edge counts into the
 * FIG.01 panel annotations. Shaders and interaction land in following commits.
 */
export async function initSchematic(mount: HTMLElement): Promise<void> {
  const dpr = Math.min(window.devicePixelRatio, 2)
  const stage = createStage(mount)
  const graph = buildNodeGraph(64, 3, dpr)

  graph.group.rotation.set(0.32, 0.5, 0)
  stage.scene.add(graph.group)

  const applyThemeColor = (): void => {
    const light = document.documentElement.getAttribute('data-theme') === 'light'
    graph.uniforms.uColor.value.set(light ? 0x0e8f7e : 0x34e5c8)
    graph.uniforms.uColorHot.value.set(light ? 0x0b5c50 : 0xeafff8)
  }
  applyThemeColor()
  window.addEventListener('themechange', applyThemeColor)

  const label = document.createElement('div')
  label.className = 'viz-label mono'
  mount.appendChild(label)
  const interaction = createInteraction(stage, graph, label)

  stage.onFrame((dt) => {
    graph.uniforms.uTime.value += dt
    graph.group.rotation.y += dt * 0.14
    graph.group.rotation.x += dt * 0.03
    interaction.update(dt)
  })

  annotate(mount, graph.count, graph.edgeCount)

  stage.start()
  document.documentElement.classList.add('webgl-on')
}

/** Reflect the real graph size in the panel's mono read-outs. */
function annotate(mount: HTMLElement, nodes: number, edges: number): void {
  const panel = mount.closest('.hero__viz')
  const foot = panel?.querySelector('.hero__viz-bar--foot')
  if (!foot) return
  const spans = foot.querySelectorAll('span')
  if (spans[0]) spans[0].textContent = `NODES·${nodes}`
  if (spans[1]) spans[1].textContent = `EDGES·${edges}`
}
