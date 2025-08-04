# MDX Server

Adapted from mquintal's work on [react-router-mdx](https://github.com/mquintal/react-router-mdx)

## Features

- Supports SSR and SSG
- In SSR mode, the parsing of the MDX file is cached in memory using a LRU cache
- Frontmatter data available in MDX via the `frontmatter` object
- Frontmatter data available in the page loader and component via `mdxServer.loadMdx` and the `useMdxAttributes` hook.
- Extra data available in MDX via the `loaderData` object

## Usage

```ts
// app/mdx-server.ts
import { MDXServer } from './server'

const mdxServer = new MDXServer({
  // src: dir relative to the root of the project ====> component page: dir relative to the app dir
  'app/routes/_markdown': 'routes/_markdown/page.tsx',
})
```

### Static Site Generation (optional)

```ts
// react-router.config.ts
import { mdxServer } from './app/mdx-server'

export default {
  ssr: true,
  async prerender() {
    // For static MDX site generation (e.g. docs), you can prerender the paths:
    return [...mdxServer.getPaths()]
  },
} satisfies Config
```
