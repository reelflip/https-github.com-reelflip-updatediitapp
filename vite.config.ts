import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // This function tells the builder how to group files
        manualChunks(id) {
          // 1. Put all third-party libraries (React, Recharts, etc) in a 'vendor' file
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          // 2. Create separate files for each View (Dashboard, Admin, etc)
          if (id.includes('/views/')) {
            return 'view-' + id.toString().split('/views/')[1].split('.')[0].toLowerCase();
          }
          // 3. Create separate files for Services (Gemini, API)
          if (id.includes('/services/')) {
            return 'service-' + id.toString().split('/services/')[1].split('.')[0].toLowerCase();
          }
        },
        // Ensure the filenames are clean and predictable
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});