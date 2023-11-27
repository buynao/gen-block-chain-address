import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import wasm from 'vite-plugin-wasm';
import inject from '@rollup/plugin-inject';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import polyfillNode from 'rollup-plugin-polyfill-node';
import nodePolyfills from 'rollup-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [wasm(), react()],
  build: {
    rollupOptions: {
      plugins: [inject({ Buffer: ['Buffer', 'Buffer'] })],
    },
  },
  resolve: {
    alias: {
      crypto: 'crypto-browserify',
      events: 'rollup-plugin-node-polyfills/polyfills/events',
      stream: 'stream-browserify',
    },
  },
  // resolve: {
  //   alias: {
  //     http: require.resolve('rollup-plugin-node-builtins'),
  //     path: require.resolve('rollup-plugin-node-builtins'),
  //     fs: require.resolve('rollup-plugin-node-builtins'),
  //     os: require.resolve('rollup-plugin-node-builtins'),
  //     tslib: require.resolve('rollup-plugin-node-builtins'),
  //     child_process: require.resolve('rollup-plugin-node-builtins'),
  //     crypto: require.resolve('rollup-plugin-node-builtins'),
  //     stream: require.resolve('rollup-plugin-node-builtins'),
  //     https: require.resolve('rollup-plugin-node-builtins'),
  //     http2: require.resolve('rollup-plugin-node-builtins'),
  //     process: require.resolve('rollup-plugin-node-builtins'),
  //   },
  // },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
      ],
    },
  },
});
