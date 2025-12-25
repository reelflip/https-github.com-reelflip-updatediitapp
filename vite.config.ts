
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // CRITICAL: This ensures the app works in subfolders like /iittracker/
  base: './', 
  build: {
    outDir: 'dist',
    minify: 'esbuild', 
    sourcemap: false,
    rollupOptions: {
      output: {
        // Standard bundling is more reliable for XAMPP deployments
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 3000,
    open: true
  }
});
