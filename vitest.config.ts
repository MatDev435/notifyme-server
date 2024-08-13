import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // environmentMatchGlobs: [
    //   ['./src/http/controllers/**', './src/vitest-environments/prisma.ts'],
    // ],
    globals: true,
  },
})
