import { reactRouterHonoDevServer } from '@pizzajsdev/react-router-hono/vite'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouterHonoDevServer({
      entryFile: 'server.node.ts',
    }),
    reactRouter(),
    tsconfigPaths(),
  ],
  // If defined, the base path should contain start + end slashes, e.g. VITE_APP_BASE_PATH=/foo/
  // base: process.env['PIZZA_APP_BASE_PATH'],
})
