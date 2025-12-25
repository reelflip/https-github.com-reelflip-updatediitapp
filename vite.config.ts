
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    // Disable minification so the output files are human-readable
    minify: false,
    // Ensure CSS isn't bundled into a single file if possible
    cssCodeSplit: true,
    rollupOptions: {
      // Mandates that Rollup exports symbols correctly for individual modules
      preserveEntrySignatures: 'exports-only',
      output: {
        // CRITICAL: Prevents the "one giant file" behavior
        preserveModules: true,
        // Maintains the root folder structure in the output
        preserveModulesRoot: '.',
        // Outputs standard ES modules
        format: 'es',
        // Maps source filenames to output filenames (e.g., views/Dashboard.tsx -> views/Dashboard.js)
        entryFileNames: (chunkInfo) => {
          return '[name].js';
        },
        // Places assets in a consistent location
        assetFileNames: 'assets/[name].[ext]',
        // Ensures individual chunks are not combined
        chunkFileNames: '[name].js',
      },
    },
  },
  server: {
    port: 3000,
    open: true
  }
});
