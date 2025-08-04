import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import babel from 'vite-plugin-babel'
import tsconfigPaths from 'vite-tsconfig-paths'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    // https://react.dev/learn/react-compiler/installation#usage-with-react-router
    babel({
      filter: /\.tsx?$/,
      babelConfig: {
        presets: ['@babel/preset-typescript'],
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tsconfigPaths(),
    {
      name: 'generate-web-manifest',
      async buildStart() {
        try {
          // Dynamically import the webManifest config
          const configPath = resolve(__dirname, 'app/config.ts')
          const { webManifest } = await import(configPath + '?t=' + Date.now()) // Cache busting

          // Generate the manifest file
          const manifestContent = JSON.stringify(webManifest, null, 2)
          const manifestPath = resolve(__dirname, 'public/site.webmanifest')

          writeFileSync(manifestPath, manifestContent + '\n')
          console.log('✓ Generated site.webmanifest from app/config.ts')
        } catch (error) {
          console.error('Failed to generate site.webmanifest:', error)
          throw error
        }
      },
    },
  ],
})
