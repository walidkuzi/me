import { createStage } from './scene'
import { buildNodeGraph } from './nodegraph'

/**
 * Entry point for the hero "system schematic". Lazily imported by main.ts only
 * when the panel is in view and motion/WebGL are permitted. Builds the
 * node-graph, slowly rotates it, and reports its real node/edge counts into the
 * FIG.01 panel annotations. Shaders and interaction land in following commits.
 */
export async function initSchematic(mount: HTMLElement): Promise<void> {
  const stage = createStage(mount)
  const graph = buildNodeGraph(64, 3)

  graph.group.rotation.set(0.32, 0.5, 0)
  stage.scene.add(graph.group)

  stage.onFrame((dt) => {
    graph.group.rotation.y += dt * 0.14
    graph.group.rotation.x += dt * 0.03
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
