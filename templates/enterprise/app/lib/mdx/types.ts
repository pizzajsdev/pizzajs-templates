import type { run } from '@mdx-js/mdx'

type MDXContent = Awaited<ReturnType<typeof run>>['default']
type MDXProps = Parameters<MDXContent>[0]

export type MDXComponents = MDXProps['components']

export interface MDXServerConfig {
  [basePath: string]: string // basePath -> componentFile
}

export interface MDXLoadResult {
  __raw: string
  attributes: Record<string, any>
}

export interface MDXFileInfo {
  path: string
  slug: string
  [key: string]: any
}
