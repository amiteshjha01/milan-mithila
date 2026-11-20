import type { MetadataRoute } from 'next'
import { getSiteUrl } from '@/lib/seo'

const PRIVATE_DISALLOW = [
  '/api/',
  '/admin',
  '/dashboard',
  '/discover',
  '/profiles',
  '/profile',
  '/messages',
  '/interests',
  '/shortlist',
  '/settings',
  '/login',
  '/signup',
  '/reset-password',
]

const PUBLIC_ALLOW = [
  '/',
  '/about',
  '/culture',
  '/how-it-works',
  '/kundali-matching',
  '/biodata',
  '/milan-select',
  '/membership',
  '/safety',
  '/contact',
  '/privacy',
  '/terms',
  '/llms.txt',
  '/llms-full.txt',
]

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()

  return {
    rules: [
      {
        userAgent: '*',
        allow: PUBLIC_ALLOW,
        disallow: PRIVATE_DISALLOW,
      },
      {
        userAgent: ['OAI-SearchBot', 'PerplexityBot', 'Claude-SearchBot', 'Googlebot', 'Bingbot', 'Applebot'],
        allow: PUBLIC_ALLOW,
        disallow: PRIVATE_DISALLOW,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
