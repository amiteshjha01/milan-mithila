import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl()
  const lastModified = new Date()

  const routes: Array<{
    path: string
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
    priority: number
  }> = [
    { path: '', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/kundali-matching', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/biodata', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/culture', changeFrequency: 'monthly', priority: 0.85 },
    { path: '/how-it-works', changeFrequency: 'monthly', priority: 0.85 },
    { path: '/milan-select', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/membership', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/safety', changeFrequency: 'monthly', priority: 0.75 },
    { path: '/contact', changeFrequency: 'yearly', priority: 0.6 },
    { path: '/privacy', changeFrequency: 'yearly', priority: 0.5 },
    { path: '/terms', changeFrequency: 'yearly', priority: 0.5 },
  ]

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
