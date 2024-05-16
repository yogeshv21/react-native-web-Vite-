import path from 'path';
import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import simpleHtmlPlugin from 'vite-plugin-simple-html';
import react from '@vitejs/plugin-react';

import { transformSync } from 'esbuild';
import { readFileSync } from 'fs';

const extensions = [
  ".web.tsx",
  ".tsx",
  ".web.ts",
  ".ts",
  ".web.jsx",
  ".jsx",
  ".web.js",
  ".js",
  ".css",
  ".json",
  ".mjs",
];

const rollupPlugin = (matchers) => ({
  name: 'js-in-jsx',
  load(id) {
    if (matchers.some((matcher) => matcher.test(id)) && id.endsWith('.js')) {
      const file = readFileSync(id, { encoding: 'utf-8' });
      return transformSync(file, { loader: 'jsx', jsx: 'automatic' });
    }
  },
});

export default defineConfig({
  define: {
    global: 'window',
  },
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
    extensions: extensions,
  },

  // build: {
  //   rollupOptions: {
  //     plugins: [rollupPlugin([/react-native-select-dropdown/])],
  //   },
  // },

  server: {
    port: 4200,
    host: 'localhost',
  },

  plugins: [
    react(),
    reactRefresh(),
    simpleHtmlPlugin({
      template: path.join(__dirname, 'index.html'),
    }),
  ],
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
      resolveExtensions: extensions,
      jsx: "automatic",
    },
  },
})