import { resolve } from 'node:path'
import { createRequire } from 'node:module'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import rollupNodePolyFill from 'rollup-plugin-node-polyfills'

const require = createRequire(import.meta.url)

export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
    svgr({
      svgrOptions: {
        svgoConfig: {
          plugins: [{ name: 'removeViewBox', active: false }],
        },
      },
    }),
    nodePolyfills({ protocolImports: true }),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      buffer: 'rollup-plugin-node-polyfills/polyfills/buffer-es6.js',
      process: 'rollup-plugin-node-polyfills/polyfills/process-es6',
      util: 'rollup-plugin-node-polyfills/polyfills/util',
    },
  },

  optimizeDeps: {
    esbuildOptions: {
      define: { global: 'globalThis' },
      inject: [require.resolve('buffer/')],
    },
  },

  server: {
    allowedHosts: [
      'spotlight-springer-flame-studying.trycloudflare.com',
      'nymb-interface.vercel.app',
      'ever-paint-representing-crossing.trycloudflare.com',
      'reviewer-supervision-dna-prayer.trycloudflare.com',
      'grade-refurbished-turns-organised.trycloudflare.com',
      'polish-app-consultancy-tom.trycloudflare.com',
      'involves-marilyn-dumb-suit.trycloudflare.com',
    ],
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    commonjsOptions: {
      transformMixedEsModules: true,
      requireReturnsDefault: 'auto',
      esmExternals: true,
    },
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          buffer: ['buffer'],
        },
        format: 'es',
        plugins: [rollupNodePolyFill()],
      },
    },
  },

  preview: {
    port: 4173,
    strictPort: true,
  },
})
