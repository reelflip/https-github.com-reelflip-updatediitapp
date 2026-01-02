
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    minify: false, // Ensure compiled JS remains indented and readable as requested
    sourcemap: false,
    rollupOptions: {
      output: {
        // Preserves folder structure for generated entry files
        entryFileNames: '[name].js',
        // Preserves folder structure for chunks/lazy-loaded modules
        chunkFileNames: (chunkInfo: any) => {
          // Use the original module name to ensure 1:1 mapping in chunks
          const name = chunkInfo.name;
          return `${name}.js`;
        },
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  server: {
    port: 3000,
    open: true
  }
});
