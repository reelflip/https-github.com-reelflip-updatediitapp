
import { defineConfig } from 'react-scripts';
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
        // Preserves folder structure for generated JS files
        entryFileNames: '[name].js',
        chunkFileNames: (chunkInfo) => {
          // Use the original module path to name the chunk
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
