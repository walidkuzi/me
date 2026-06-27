import * as THREE from 'three'
import { nodeVertex, nodeFragment, edgeVertex, edgeFragment } from './shaders'

/**
 * Builds the "system schematic": a cloud of nodes connected to their nearest
 * neighbours, like an abstract orchestration graph. Node 0 is the hub at the
 * centre. Geometry carries per-node size/seed/index attributes so the shader
 * pass can animate and highlight individual nodes without rebuilding buffers.
 */
export interface GraphUniforms {
  uTime: { value: number }
  uColor: { value: THREE.Color }
  uColorHot: { value: THREE.Color }
  uPixelRatio: { value: number }
  uHighlight: { value: number }
}

export interface NodeGraph {
  group: THREE.Group
  points: THREE.Points
  lines: THREE.LineSegments
  positions: Float32Array
  uniforms: GraphUniforms
  count: number
  edgeCount: number
  dispose(): void
}

function buildPositions(n: number): Float32Array {
  const pos = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = 2.65 * Math.cbrt(Math.random()) // uniform within a ball
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.82 // gently flattened
    pos[i * 3 + 2] = r * Math.cos(phi)
  }
  pos[0] = pos[1] = pos[2] = 0 // hub
  return pos
}

function buildEdges(pos: Float32Array, n: number, k: number): Uint16Array {
  const out: number[] = []
  const seen = new Set<number>()
  const neighbours: { j: number; d: number }[] = []
  for (let i = 0; i < n; i++) {
    neighbours.length = 0
    for (let j = 0; j < n; j++) {
      if (i === j) continue
      const dx = pos[i * 3] - pos[j * 3]
      const dy = pos[i * 3 + 1] - pos[j * 3 + 1]
      const dz = pos[i * 3 + 2] - pos[j * 3 + 2]
      neighbours.push({ j, d: dx * dx + dy * dy + dz * dz })
    }
    neighbours.sort((a, b) => a.d - b.d)
    for (let m = 0; m < k && m < neighbours.length; m++) {
      const j = neighbours[m].j
      const key = i < j ? i * n + j : j * n + i
      if (seen.has(key)) continue
      seen.add(key)
      out.push(i, j)
    }
  }
  return Uint16Array.from(out)
}

export function buildNodeGraph(nodeCount = 64, neighbours = 3, pixelRatio = 1): NodeGraph {
  const positions = buildPositions(nodeCount)
  const edges = buildEdges(positions, nodeCount, neighbours)

  const uniforms: GraphUniforms = {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(0x34e5c8) },
    uColorHot: { value: new THREE.Color(0xeafff8) },
    uPixelRatio: { value: pixelRatio },
    uHighlight: { value: -1 },
  }

  // ---- Nodes ----
  const sizes = new Float32Array(nodeCount)
  const seeds = new Float32Array(nodeCount)
  const indices = new Float32Array(nodeCount)
  for (let i = 0; i < nodeCount; i++) {
    sizes[i] = i === 0 ? 2.6 : 0.7 + Math.random() * 0.9
    seeds[i] = Math.random() * Math.PI * 2
    indices[i] = i
  }

  const pointGeo = new THREE.BufferGeometry()
  pointGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  pointGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  pointGeo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
  pointGeo.setAttribute('aIndex', new THREE.BufferAttribute(indices, 1))

  const pointMat = new THREE.ShaderMaterial({
    uniforms: { ...uniforms, uSize: { value: 30 } },
    vertexShader: nodeVertex,
    fragmentShader: nodeFragment,
    transparent: true,
    depthWrite: false,
  })
  const points = new THREE.Points(pointGeo, pointMat)

  // ---- Edges ----
  const edgePositions = new Float32Array(edges.length * 3)
  for (let e = 0; e < edges.length; e++) {
    const node = edges[e]
    edgePositions[e * 3] = positions[node * 3]
    edgePositions[e * 3 + 1] = positions[node * 3 + 1]
    edgePositions[e * 3 + 2] = positions[node * 3 + 2]
  }
  const lineGeo = new THREE.BufferGeometry()
  lineGeo.setAttribute('position', new THREE.BufferAttribute(edgePositions, 3))

  const lineMat = new THREE.ShaderMaterial({
    uniforms: { ...uniforms, uOpacity: { value: 0.26 } },
    vertexShader: edgeVertex,
    fragmentShader: edgeFragment,
    transparent: true,
    depthWrite: false,
  })
  const lines = new THREE.LineSegments(lineGeo, lineMat)

  const group = new THREE.Group()
  group.add(lines, points)

  return {
    group,
    points,
    lines,
    positions,
    uniforms,
    count: nodeCount,
    edgeCount: edges.length / 2,
    dispose() {
      pointGeo.dispose()
      pointMat.dispose()
      lineGeo.dispose()
      lineMat.dispose()
    },
  }
}
