import { compile } from '@mdx-js/mdx'
import { layout, route } from '@react-router/dev/routes'
import { globSync } from 'glob'
import matter from 'gray-matter'
import { LRUCache } from 'lru-cache'
import { existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import remarkFrontmatter from 'remark-frontmatter'
import type { MDXLoadResult, MDXServerConfig } from './types'

export class MDXFileNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MDXFileNotFoundError'
  }
}

const CACHE_MAX_SIZE = 1000 // 1000 mdx pages
const CACHE_TTL_DEV = 1000 * 10 // 10 seconds in dev
const CACHE_TTL_PROD = 1000 * 60 * 60 * 24 // 24 hours in prod

export class MDXServer {
  private config: MDXServerConfig
  private lruCache: LRUCache<string, MDXLoadResult>

  constructor(config: MDXServerConfig) {
    this.config = config
    this.lruCache = new LRUCache({
      max: CACHE_MAX_SIZE,
      ttl: import.meta.env.DEV ? CACHE_TTL_DEV : CACHE_TTL_PROD,
    })
  }

  private slash(path: string): string {
    const isExtendedLengthPath = path.startsWith('\\\\?\\')

    if (isExtendedLengthPath) {
      return path
    }

    return path.replace(/\\/g, '/')
  }

  private listMdxFilesSync(paths: string[]): string[][] {
    return paths.map((pathStr) => globSync(path.resolve(process.cwd(), pathStr, '**', '*.mdx')))
  }

  private getSafeFilePathBasedOnUrl(url: string): string | null {
    const urlPath = new URL(url).pathname

    // More comprehensive path sanitization
    const sanitizedPath = urlPath
      .replace(/[~]/g, '') // Remove tilde
      .replace(/\.\./g, '') // Remove path traversal
      .replace(/\/+/g, '/') // Normalize slashes
      .replace(/^\/+|\/+$/g, '') // Remove leading/trailing slashes
      .replace(/[^\w\-_/]/g, '') // Only allow alphanumeric, hyphens, underscores, and slashes

    // Reject if sanitization changed the path significantly
    if (sanitizedPath !== urlPath.replace(/^\/+|\/+$/g, '')) {
      return null
    }

    // Reject empty paths or paths that are too long
    if (!sanitizedPath || sanitizedPath.length > 1000) {
      return null
    }

    const basePaths = Object.keys(this.config)
    const potentialFilePaths = basePaths.map((basePath) => path.join(process.cwd(), basePath, `${sanitizedPath}.mdx`))

    // Try to find the file in any of the base paths
    for (const potentialFilePath of potentialFilePaths) {
      if (existsSync(potentialFilePath)) {
        return potentialFilePath
      }
    }

    return null
  }

  private getMdxAttributes(content: string): Record<string, any> {
    const { data: attributes } = matter(content)
    return attributes
  }

  private async getFileContent(path: string): Promise<string> {
    const content = await readFile(path, { encoding: 'utf-8' })

    // Prevent loading extremely large files (1MB limit)
    const MAX_FILE_SIZE = 1024 * 1024 // 1MB
    if (content.length > MAX_FILE_SIZE) {
      throw new Error(`MDX file too large: ${path}`)
    }

    return content
  }

  private async compileMdx(
    mdxContent: string,
    attributes: Record<string, any>,
    data?: Record<string, any>,
  ): Promise<string> {
    // Inject frontmatter attributes as a single export statement
    const frontmatterExport = `export const frontmatter = ${JSON.stringify(attributes, null, 2)};`
    const dataExport = `export const data = ${JSON.stringify(data, null, 2)};`

    // Extract frontmatter block and content separately
    const frontmatterMatch = mdxContent.match(/^---[\s\S]*?---\n/)
    const frontmatterBlock = frontmatterMatch ? frontmatterMatch[0] : ''
    const contentWithoutFrontmatter = mdxContent.replace(/^---[\s\S]*?---\n/, '')

    // Arrange: frontmatter first, then export, then content
    const mdxWithExports = `${frontmatterBlock}${frontmatterExport}\n\n${dataExport}\n\n${contentWithoutFrontmatter}`

    const compiled = await compile(mdxWithExports, {
      outputFormat: 'function-body',
      remarkPlugins: [remarkFrontmatter],
    })

    return String(compiled)
  }

  /**
   * Get all URL paths for MDX files
   */
  getPaths(): string[] {
    const basePaths = Object.keys(this.config)
    const pathsFiles = this.listMdxFilesSync(basePaths)

    return pathsFiles.flatMap((pathFiles, index) => {
      const basePath = basePaths[index]

      return pathFiles.map((pathFile) => {
        // Extract just the filename without extension from the full path
        const [, fileName] = pathFile.split(basePath)
        if (fileName) {
          return this.slash(fileName).replace('.mdx', '')
        }
        throw new Error(`Path "${basePath}" is not found on "${pathFile}" file path.`)
      })
    })
  }

  /**
   * Generate React Router routes for all MDX files
   */
  getRoutes(layoutPath?: string) {
    const basePaths = Object.keys(this.config)
    const pathsFiles = this.listMdxFilesSync(basePaths)

    return pathsFiles.flatMap((pathFiles, index) => {
      const basePath = basePaths[index]
      const componentPath = this.config[basePath]

      const routes = pathFiles.map((pathFile) => {
        // Extract just the filename without extension from the full path
        const [, fileName] = pathFile.split(basePath)
        if (fileName) {
          const cleanFileName = this.slash(fileName).replace('.mdx', '')
          // Create route path without the base directory (just the filename)
          const finalUrlPath = cleanFileName

          return route(finalUrlPath, componentPath, {
            id: finalUrlPath,
          })
        }
        throw new Error(`Path "${basePath}" is not found on "${pathFile}" file path.`)
      })

      if (layoutPath) {
        return [layout(layoutPath, { id: `mdxLayout_${basePath}` }, routes)]
      }

      return routes
    })
  }

  /**
   * Load and compile MDX content for a specific request
   */
  async loadMdx(request: Request, data?: Record<string, any>): Promise<MDXLoadResult> {
    try {
      // Validate and sanitize cache key
      const url = request.url

      // Prevent cache key injection by limiting size
      if (url.length > 1000) {
        throw new Error('Request too large for caching')
      }

      const cacheKey = url
      const cachedResult = this.lruCache.get(cacheKey)
      if (cachedResult) {
        return cachedResult
      }

      const filePath = this.getSafeFilePathBasedOnUrl(request.url)
      if (!filePath) {
        throw new MDXFileNotFoundError(`No MDX file found for URL "${request.url}"`)
      }

      const content = await this.getFileContent(filePath)
      const attributes = this.getMdxAttributes(content)

      const [mdxContent] = await Promise.all([this.compileMdx(content, attributes, data)])

      const result: MDXLoadResult = {
        __raw: mdxContent,
        attributes,
      }

      this.lruCache.set(cacheKey, result)

      return result
    } catch (error) {
      // Log errors for debugging (in development)
      if (import.meta.env.DEV) {
        console.error('MDX Server Error:', error)
      }
      throw error
    }
  }
}
