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
})
