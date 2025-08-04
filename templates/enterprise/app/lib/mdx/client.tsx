import { runSync } from '@mdx-js/mdx'
import { MDXProvider } from '@mdx-js/react'
import { useLoaderData } from 'react-router'
import * as runtime from 'react/jsx-runtime'
import type { MDXFileInfo, MDXLoadResult } from './types'

export const useMdxAttributes = () => {
  const { attributes } = useLoaderData<MDXLoadResult>()

  return attributes
}
export const useMdxFiles = () => {
  return useLoaderData<MDXFileInfo[]>()
}

type MDXContent = ReturnType<typeof runSync>['default']
type MDXProps = Parameters<MDXContent>[0]
type MDXComponents = MDXProps['components']

export const useMdxComponent = <T extends MDXComponents>(components?: T) => {
  const { attributes, __raw } = useLoaderData<MDXLoadResult>()
  const { default: Component } = runSync(__raw, { ...runtime, baseUrl: import.meta.url })

  return () => (
    <MDXProvider>
      <Component components={components} {...attributes} />
    </MDXProvider>
  )
}
