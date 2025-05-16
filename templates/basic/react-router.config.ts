import { createAutomaticPreset } from '@pizzajsdev/react-router-hono/presets/auto'
import type { Config } from '@react-router/dev/config'

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: true,
  future: {
    unstable_optimizeDeps: true,
  },
  presets: [createAutomaticPreset()],
  // If defined, the base path should contain start + end slashes, e.g. VITE_APP_BASE_PATH=/foo/
  // basename: import.meta.env['PIZZA_APP_BASE_PATH'],
} satisfies Config
