import type { Config } from '@react-router/dev/config'

export default {
  // Config options...
  // To enable SPA mode we set this to `false`, otherwise it will be SSR by default
  ssr: false,
  future: {
    unstable_optimizeDeps: true,
  },
} satisfies Config
