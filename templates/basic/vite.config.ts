import { reactRouterHonoDevServer } from '@pizzajsdev/react-router-hono/vite'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type PluginOption } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouterHonoDevServer({
      entryFile: 'server.node.ts',
    }) as PluginOption,
    reactRouter(),
    tsconfigPaths(),
  ],
  // If defined, the base path should contain start + end slashes, e.g. PIZZA_APP_BASE_PATH=/foo/
  // base: process.env['PIZZA_APP_BASE_PATH'],
})
