import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/infra/http/server.ts'],
  format: 'esm',
  target: 'node24',
  outDir: 'dist',
  clean: true,
})
