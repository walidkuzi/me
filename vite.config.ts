import { defineConfig } from 'vite'

// Project pages site served from https://walidkuzi.github.io/me/
// `base` must match the repo path so hashed assets resolve in production.
export default defineConfig({
  base: '/me/',
  build: {
    target: 'es2022',
    cssTarget: 'chrome111',
    // Three.js is heavy; keep it in its own lazily-loaded chunk so it never
    // blocks first paint. The dynamic import() in src/three keeps it split.
    chunkSizeWarningLimit: 900,
  },
})
