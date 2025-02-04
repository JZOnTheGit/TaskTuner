import { Metadata } from 'next'

const defaultMetadata: Metadata = {
  title: 'TaskTuner - Smart Calendar Management',
  description: 'TaskTuner helps you manage your schedule intelligently with AI-powered event suggestions and smart calendar organization.',
  keywords: 'calendar, scheduling, AI calendar, task management, time management, smart scheduling',
  authors: [{ name: 'TaskTuner' }],
  openGraph: {
    title: 'TaskTuner - Smart Calendar Management',
    description: 'Manage your schedule intelligently with AI-powered suggestions',
    url: 'https://task-tuner-brown.vercel.app',
    siteName: 'TaskTuner',
    images: [
      {
        url: '/og-image.png', // Add your OG image
        width: 1200,
        height: 630,
        alt: 'TaskTuner Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TaskTuner - Smart Calendar Management',
    description: 'Manage your schedule intelligently with AI-powered suggestions',
    images: ['/twitter-image.png'], // Add your Twitter card image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default defaultMetadata 