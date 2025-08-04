import { collectRoutes } from '@pizzajsdev/app-router-fs'
import { createRouterConfig } from '@pizzajsdev/app-router-fs/adapters/react-router'
import { mdxServer } from './runtime/mdx.server'

export const collectedRoutes = collectRoutes('routes', ['.tsx', '.ts'], process.cwd() + '/app')
const fileBasedRoutes = createRouterConfig(collectedRoutes)
const mdxRoutes = mdxServer.getRoutes('routes/layout.tsx')

export default [...mdxRoutes, ...fileBasedRoutes]
