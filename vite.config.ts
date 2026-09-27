import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    // the 3D scene is one lazily-loaded chunk (three + r3f); it never blocks first paint
    chunkSizeWarningLimit: 1000,
  },
  test: {
    environment: 'node',
  },
})
