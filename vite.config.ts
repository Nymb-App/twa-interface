import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import svgr from 'vite-plugin-svgr'

const require = createRequire(import.meta.url)

export default defineConfig(({ mode }) => ({
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
    mode === 'analyze' &&
      visualizer({
        open: true,
        filename: 'bundle-analyzer-report.html',
        gzipSize: true,
        brotliSize: true,
        template: 'flamegraph',
      }),
  ].filter(Boolean),

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
      'nymb-interface.vercel.app',
      'involvement-dawn-cold-checking.trycloudflare.com',
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
          'vendor-howler': ['howler'],
          'vendor-tanstack': ['@tanstack/react-query'],
          'vendor-react': ['react', 'react-dom', 'react-icons'],
        },
      },
    },
  },

  preview: {
    port: 4173,
    strictPort: true,
  },
}))
