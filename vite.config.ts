
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: false, // Keep output readable
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // This is the key setting to create individual files
        preserveModules: true,
        preserveModulesRoot: '.',
        entryFileNames: (chunkInfo) => {
          return '[name].js';
        },
        assetFileNames: 'assets/[name].[ext]',
        // Ensure React is handled correctly in non-bundled output
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
