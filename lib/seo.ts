import type { Metadata } from 'next'

export const SITE_NAME = 'Mithila Milan'
export const SITE_TAGLINE = 'Maithil Matrimony Rooted in Culture, Consent & Care'
export const SITE_DESCRIPTION =
  'A thoughtful, consent-first matrimonial platform for Maithil families across Mithila, India, and the global diaspora — featuring Ashtakoot Kundali matching, traditional biodata generation, and cultural heritage guides.'

export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'https://mithilamilan.com')

  return raw.replace(/\/+$/, '')
}

export const NOINDEX_ROBOTS: Metadata['robots'] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
  },
}

type PublicMetadataInput = {
  title: string
  description: string
  path: string
  keywords?: string[]
  type?: 'website' | 'article'
}

export function createPublicMetadata({
  title,
  description,
  path,
  keywords,
  type = 'website',
}: PublicMetadataInput): Metadata {
  const canonical = path.startsWith('/') ? path : `/${path}`

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type,
      locale: 'en_IN',
      siteName: SITE_NAME,
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonical,
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: ['/opengraph-image'],
    },
  }
}

export function createNoIndexMetadata(title: string, description?: string): Metadata {
  return {
    title,
    ...(description ? { description } : {}),
    robots: NOINDEX_ROBOTS,
  }
}

export function buildOrganizationJsonLd() {
  const siteUrl = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    description: SITE_DESCRIPTION,
    areaServed: ['IN', 'NP', 'US', 'GB', 'CA', 'AU', 'AE'],
    knowsAbout: [
      'Maithil Matrimony',
      'Mithila Cultural Heritage',
      'Ashtakoot Guna Milan',
      'Vedic Kundali Matching',
      'Gotra and Mool Traditions',
      'Matrimonial Biodata Design',
    ],
  }
}

export function buildWebsiteJsonLd() {
  const siteUrl = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: siteUrl,
    description: SITE_DESCRIPTION,
    inLanguage: 'en-IN',
  }
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  const siteUrl = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: `${siteUrl}${item.path.startsWith('/') ? item.path : `/${item.path}`}`,
    })),
  }
}

export function buildWebApplicationJsonLd(opts: {
  name: string
  description: string
  path: string
  applicationCategory?: string
}) {
  const siteUrl = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: opts.name,
    description: opts.description,
    url: `${siteUrl}${opts.path}`,
    applicationCategory: opts.applicationCategory || 'LifestyleApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: siteUrl,
    },
  }
}

export function buildFaqJsonLd(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
