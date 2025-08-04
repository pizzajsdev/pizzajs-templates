import type { WebAppManifest } from 'web-app-manifest'

export const appConfig = {
  name: 'ACME',
  shortName: 'ACME',
  description: 'ACME is a platform for managing your business.',
  lang: 'en-US',
  themeColor: '#020617',
  backgroundColor: '#020617',
}

export const webManifest: WebAppManifest = {
  id: 'com.acme.app',
  name: appConfig.name,
  short_name: appConfig.shortName,
  description: appConfig.description,
  theme_color: appConfig.themeColor,
  background_color: appConfig.backgroundColor,
  lang: appConfig.lang,
  start_url: './',
  orientation: 'portrait',
  display: 'standalone',
  display_override: ['window-controls-overlay'],
  categories: ['business', 'utilities'],
  icons: [
    {
      src: '/images/pwa/manifest-icon-192.maskable.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: '/images/pwa/manifest-icon-192.maskable.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable',
    },
    {
      src: '/images/pwa/manifest-icon-512.maskable.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: '/images/pwa/manifest-icon-512.maskable.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
  screenshots: [
    {
      src: '/images/pwa-screenshots/mobile-1.jpg',
      sizes: '1080x1920',
      type: 'image/jpg',
      form_factor: 'narrow',
      label: 'Lorem ipsum dolor sit amet',
    },
    {
      src: '/images/pwa-screenshots/mobile-2.jpg',
      sizes: '1080x1920',
      type: 'image/jpg',
      form_factor: 'narrow',
      label: 'Lorem ipsum dolor sit amet',
    },
    {
      src: '/images/pwa-screenshots/desktop-1.jpg',
      sizes: '2560x1440',
      type: 'image/jpg',
      form_factor: 'wide',
      label: 'Lorem ipsum dolor sit amet',
    },
  ],
  shortcuts: [
    {
      name: 'Dashboard',
      short_name: 'Dashboard',
      description: 'Dashboard page',
      url: '/dashboard',
      icons: [
        {
          src: '/images/pwa/favicon-196.png',
          sizes: '196x196',
          type: 'image/png',
        },
      ],
    },
  ],
}
