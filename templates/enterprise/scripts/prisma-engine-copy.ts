import { copyFileSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

// Fixes prisma engine issues (.so.node not found) on Vercel at runtime

const engineFile = 'libquery_engine-rhel-openssl-3.0.x.so.node'
const buildDir = join(process.cwd(), 'build', 'server')

// Find all nodejs_* dirs in build/server
const dirs = readdirSync(buildDir)
  .filter((dir) => statSync(join(buildDir, dir)).isDirectory())
  .filter((dir) => dir.startsWith('nodejs_'))

for (const dir of dirs) {
  const enginePath = join(process.cwd(), 'app', 'generated', 'prisma', engineFile)
  if (existsSync(enginePath)) {
    copyFileSync(enginePath, join(buildDir, dir, engineFile))
  }
}
