import * as THREE from 'three'

/**
 * A minimal WebGL stage: transparent renderer sized to its mount, a
 * perspective camera, a frame-callback registry and an externally
 * controllable render loop. DPR is capped for performance; resize is driven
 * by a ResizeObserver so it tracks the panel, not just the window.
 */
export type FrameCallback = (dt: number, elapsed: number) => void

export interface Stage {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  mount: HTMLElement
  onFrame(cb: FrameCallback): void
  setPixelRatioCap(cap: number): void
  start(): void
  stop(): void
  isRunning(): boolean
  dispose(): void
}

export function createStage(mount: HTMLElement): Stage {
  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
  camera.position.set(0, 0, 7.4)

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setClearColor(0x000000, 0)
  renderer.domElement.setAttribute('aria-hidden', 'true')

  let dprCap = 2
  const callbacks: FrameCallback[] = []
  const clock = new THREE.Clock()
  let raf = 0
  let running = false

  const resize = (): void => {
    const w = mount.clientWidth
    const h = mount.clientHeight
    if (!w || !h) return
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, dprCap))
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  const ro = new ResizeObserver(resize)
  ro.observe(mount)
  mount.appendChild(renderer.domElement)
  resize()

  const loop = (): void => {
    raf = requestAnimationFrame(loop)
    const dt = Math.min(clock.getDelta(), 0.05)
    const elapsed = clock.elapsedTime
    for (const cb of callbacks) cb(dt, elapsed)
    renderer.render(scene, camera)
  }

  return {
    scene,
    camera,
    renderer,
    mount,
    onFrame(cb) {
      callbacks.push(cb)
    },
    setPixelRatioCap(cap) {
      dprCap = cap
      resize()
    },
    start() {
      if (running) return
      running = true
      clock.start()
      loop()
    },
    stop() {
      if (!running) return
      running = false
      cancelAnimationFrame(raf)
      clock.stop()
    },
    isRunning() {
      return running
    },
    dispose() {
      this.stop()
      ro.disconnect()
      renderer.dispose()
      renderer.domElement.remove()
    },
  }
}
