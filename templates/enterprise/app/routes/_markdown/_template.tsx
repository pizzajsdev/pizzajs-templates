import { useMdxAttributes, useMdxComponent } from '@/lib/mdx/client'
import { cn } from '@/lib/utils'
import seo from '@/lib/utils/seo'
import { mdxServer } from '@/runtime/mdx.server'
import { z } from 'zod/v3'
import type { Route } from './+types/_template'

const frontmatterSchema = z.object({
  title: z.string(),
  robots: z.array(z.enum(['index', 'follow', 'noindex', 'nofollow'])).optional(),
  windowTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImage: z.string().optional(),
  meta: z
    .array(
      z.union([
        z.object({
          property: z.string(),
          content: z.string(),
        }),
        z.object({
          name: z.string(),
          content: z.string(),
        }),
      ]),
    )
    .optional(),
})

export async function loader({ request }: Route.LoaderArgs) {
  return mdxServer.loadMdx(request, {
    version: '1.0.0',
  })
}

export function meta({ data, location }: Route.MetaArgs) {
  if (!data?.attributes) {
    return []
  }

  const parsedFrontmatter = frontmatterSchema.safeParse(data?.attributes)

  if (!parsedFrontmatter.success) {
    throw new Error('Invalid frontmatter for page ' + location.pathname)
  }

  const frontmatter = parsedFrontmatter.data

  return [
    seo.title(frontmatter.windowTitle ?? frontmatter.title),
    frontmatter.metaDescription ? seo.description(frontmatter.metaDescription) : undefined,
    seo.robots(frontmatter.robots ?? ['index', 'follow']),
    frontmatter.ogImage ? seo.ogImage(frontmatter.ogImage) : undefined,
    ...(frontmatter.meta ?? []),
  ].filter(Boolean)
}

export default function Page() {
  const Component = useMdxComponent()
  const attributes = useMdxAttributes()

  return (
    <article
      className={cn(
        'text-main-fg flex flex-1 flex-col',
        'prose dark:prose-invert prose-headings:mt-4 prose-headings:mb-2',
        // 'prose-headings:text-main-fg',
        // 'prose-headings:mt-0 prose-li:my-0 mx-auto',
        // 'prose-a:text-links prose-a:hover:text-links-hover',
        // 'prose-a:decoration-dotted prose-a:hover:decoration-solid',
        'm-2 rounded-md bg-gray-900/80 p-4',
      )}
    >
      <h1 className="mt-0!">{attributes.title}</h1>
      <Component />
    </article>
  )
}
