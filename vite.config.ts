
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    emptyOutDir: true,
    minify: false, // Set to false to keep JS files readable as requested
    rollupOptions: {
      output: {
        // Highly granular chunking to ensure "one js per view/service"
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('/views/')) {
            // Split each view into its own file
            return 'view-' + id.toString().split('/views/')[1].split('.')[0].toLowerCase();
          }
          if (id.includes('/services/')) {
            // Split each service into its own file
            return 'service-' + id.toString().split('/services/')[1].split('.')[0].toLowerCase();
          }
          if (id.includes('/components/')) {
            // Split components group
            return 'components-bundle';
          }
        },
        chunkFileNames: 'assets/js/[name].js',
        entryFileNames: 'assets/js/[name].js',
        assetFileNames: 'assets/[ext]/[name].[ext]'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
