
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: false, // Keep code readable
    cssCodeSplit: false,
    rollupOptions: {
      // Required setting when preserveModules is true
      preserveEntrySignatures: 'exports-only',
      output: {
        // Prevents bundling everything into one file
        preserveModules: true,
        // Maintains your folder structure (views/, services/, etc.) in the dist folder
        preserveModulesRoot: '.',
        // Output format as ES modules
        format: 'es',
        // Simplifies file naming so they match your source names
        entryFileNames: (chunkInfo) => {
          return '[name].js';
        },
        // Places all assets (CSS/Images) in a clean directory
        assetFileNames: 'assets/[name].[ext]',
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
