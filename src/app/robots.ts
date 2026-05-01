import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/dashboard/settings/'],
    },
    sitemap: (process.env.NEXT_PUBLIC_BASE_URL || 'https://msme360.in') + '/sitemap.xml',
  }
}
