import * as THREE from 'three'

/**
 * Builds the "system schematic": a cloud of nodes connected to their nearest
 * neighbours, like an abstract orchestration graph. Node 0 is the hub at the
 * centre. Geometry carries per-node size/seed attributes so the shader pass can
 * animate and highlight individual nodes without rebuilding buffers.
 */
export interface NodeGraph {
  group: THREE.Group
  points: THREE.Points
  lines: THREE.LineSegments
  positions: Float32Array
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

export function buildNodeGraph(nodeCount = 64, neighbours = 3): NodeGraph {
  const positions = buildPositions(nodeCount)
  const edges = buildEdges(positions, nodeCount, neighbours)

  // ---- Nodes ----
  const sizes = new Float32Array(nodeCount)
  const seeds = new Float32Array(nodeCount)
  for (let i = 0; i < nodeCount; i++) {
    sizes[i] = i === 0 ? 2.4 : 0.7 + Math.random() * 0.9
    seeds[i] = Math.random() * Math.PI * 2
  }

  const pointGeo = new THREE.BufferGeometry()
  pointGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  pointGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1))
  pointGeo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))

  const pointMat = new THREE.PointsMaterial({
    color: 0x34e5c8,
    size: 0.11,
    sizeAttenuation: true,
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

  const lineMat = new THREE.LineBasicMaterial({
    color: 0x34e5c8,
    transparent: true,
    opacity: 0.18,
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
