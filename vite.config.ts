
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    minify: true,
    cssCodeSplit: false, // Ensure CSS is also bundled into one file
    rollupOptions: {
      output: {
        // Force everything into a single file by inlining dynamic imports
        inlineDynamicImports: true,
        // Set fixed names for the single output bundle
        entryFileNames: 'assets/bundle.js',
        chunkFileNames: 'assets/bundle.js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  server: {
    port: 3000,
    open: true
  }
});
