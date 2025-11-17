import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false,          // Disable source maps (smaller build)
    minify: 'terser',          // Use terser for smaller output
    chunkSizeWarningLimit: 1000, // Avoid chunk warnings
    cssCodeSplit: true,        // Split CSS for faster page load
    assetsInlineLimit: 4096,   // Inline small assets
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
