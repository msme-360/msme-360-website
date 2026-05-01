import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://msme360.in'
  
  // Static core routes
  const routes = [
    '',
    '/dashboard',
    '/dashboard/formalize',
    '/dashboard/operate',
    '/dashboard/grow',
    '/dashboard/connect',
    '/dashboard/community',
    '/dashboard/help',
    '/dashboard/profile',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return routes
}
