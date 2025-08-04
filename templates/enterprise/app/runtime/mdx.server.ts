import { MDXServer } from '../lib/mdx/server'

export const mdxServer = new MDXServer({
  'app/routes/_markdown': 'routes/_markdown/_template.tsx',
})
