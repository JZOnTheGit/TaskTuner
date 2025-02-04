export default function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'TaskTuner',
    applicationCategory: 'Calendar',
    operatingSystem: 'Web',
    description: 'AI-powered calendar management application',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'GDP'
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
} 