import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react()],
  test: {
    root: fileURLToPath(new URL('..', import.meta.url)),
    globals: true,
    clearMocks: false,
    include: ['src/**/*.{test,spec}.{js,jsx}', 'src/**/__tests__/**/*.js'],
    coverage: {
      provider: 'istanbul',
      exclude: ['src/**/*.{test,spec}.{js,jsx}', 'src/**/__tests__/**/*.js'],
      reporter: ['text', 'html', 'lcov', 'json'],
      thresholds: { statements: 100, branches: 95, functions: 100, lines: 100 },
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rolldownOptions: {
      output: { codeSplitting: { groups: [{ name: 'lesson-sources', test: /\.js\?raw$/ }] } },
    },
  },
  server: {
    host: '127.0.0.1',
    fs: { allow: [fileURLToPath(new URL('..', import.meta.url))] },
  },
});
