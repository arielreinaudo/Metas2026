import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  // Ensure process.env doesn't crash in client if accessed directly (though we updated apiService)
  define: {
    'process.env': {}
  }
});