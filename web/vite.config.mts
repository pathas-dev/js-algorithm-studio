import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react()],
  build: { outDir: '../dist', emptyOutDir: true },
  server: {
    host: '127.0.0.1',
    fs: { allow: [fileURLToPath(new URL('..', import.meta.url))] },
  },
});
