import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import path from 'path';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    base: isProduction ? '/Portfolio/' : '/',

    plugins: [react(), tailwindcss()],

    server: { port: 3000, host: '0.0.0.0' },

    resolve: {
      alias: {
        '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.')
      }
    },

    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/three/')) return 'three';
            if (id.includes('@react-three') || id.includes('postprocessing') || id.includes('/maath/'))
              return 'r3f';
            if (id.includes('/vgpu/') || id.includes('@vgpu/')) return 'vgpu';
            if (id.includes('/ogl/')) return 'ogl';
            if (id.includes('framer-motion') || id.includes('/gsap/')) return 'motion';
          }
        }
      }
    }
  };
});
