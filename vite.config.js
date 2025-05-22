// vite.config.js
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

export default defineConfig({

  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
    svgr({
      svgoConfig: {
        plugins: [{ name: 'removeViewBox', active: false }],
      },
    }),
  ],

  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },

  optimizeDeps: {
    esbuildOptions: {
      define: { global: 'globalThis' },
      plugins: [NodeGlobalsPolyfillPlugin({ buffer: true })],
    },
  },

  server: {
    // только для vite dev
    allowedHosts: [
      'bobby-karma-malaysia-sodium.trycloudflare.com',
      'nymb-interface.vercel.app'
    ],
  },

  // Опции, которые применяются к npm run build
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    commonjsOptions: {
      transformMixedEsModules: true,
      requireReturnsDefault: 'auto',
      esmExternals: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          buffer: ['buffer'],
        },
        format: 'es',
      },
    },
  },

  // Опции для vite preview
  preview: {
    port: 4173,
    strictPort: true,
    // по умолчанию preview отдаёт именно папку из build.outDir
    // с базовым путём из base
  },
})