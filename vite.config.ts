import { defineConfig } from 'vitest/config';

export default defineConfig({
  root: 'tools/thumbnail-test',
  base: './',
  server: { port: 5179, strictPort: true },
  preview: { port: 5179, strictPort: true },
  build: { outDir: '../../dist', emptyOutDir: true },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
