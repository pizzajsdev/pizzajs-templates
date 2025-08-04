import { appConfig } from '@/config'

function metaTitle(title?: string, suffix = ' - ' + appConfig.name) {
  return {
    title: title ? `${title}${suffix}` : appConfig.name,
  }
}

function metaDescription(description: string) {
  return {
    name: 'description',
    content: description,
  }
}

function metaRobots(robots: Array<'index' | 'follow' | 'noindex' | 'nofollow'> = ['index', 'follow']) {
  return {
    name: 'robots',
    content: robots.join(', '),
  }
}

function metaIndexFollow() {
  return {
    name: 'robots',
    content: 'index, follow',
  }
}

function metaNoIndexNoFollow() {
  return {
    name: 'robots',
    content: 'noindex, nofollow',
  }
}

function metaOgImage(imageUrl: string) {
  return {
    property: 'og:image',
    content: imageUrl,
  }
}

const seo = {
  title: metaTitle,
  description: metaDescription,
  robots: metaRobots,
  indexFollow: metaIndexFollow,
  noIndexNoFollow: metaNoIndexNoFollow,
  ogImage: metaOgImage,
}

export default seo
