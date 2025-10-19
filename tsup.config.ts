import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.ts', 'standalone.ts', 'elysia.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  target: 'es2020',
  minify: false,
  treeshake: true,
  external: ['elysia', 'winston', 'chalk'],
  noExternal: [],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    }
    options.define = {
      'require.resolve': 'undefined'
    }
  },
  platform: 'node',
})
