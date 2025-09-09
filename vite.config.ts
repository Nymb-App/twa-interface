import { resolve } from 'node:path'
import { createRequire } from 'node:module'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import viteReact from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import { visualizer } from 'rollup-plugin-visualizer'

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
      'spend-contracting-club-forwarding.trycloudflare.com',
      'lance-opportunities-candy-tuition.trycloudflare.com',
      'localhost:100',
      'exception-bowling-amy-breaking.trycloudflare.com',
      'september-now-five-stakeholders.trycloudflare.com',
      'honest-corruption-grab-leu.trycloudflare.com',
      'e658-37-1-204-162.ngrok-free.app',
      'administrator-sole-implementing-obvious.trycloudflare.com',
      'ambien-projection-aggregate-proprietary.trycloudflare.com',
      'exp-photographic-continuous-executed.trycloudflare.com',
      'exams-repeated-faq-connecticut.trycloudflare.com',
      'chinese-agreed-written-copyrighted.trycloudflare.com',
      'fan-difficulty-peterson-bailey.trycloudflare.com',
      'town-suggested-seas-sisters.trycloudflare.com',
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
