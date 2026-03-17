import { Metadata } from 'next';
import FinancialConnectClient from './FinancialConnectClient';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Financial Connect Hub | MSME 360',
  description: 'Bridge the gap between your business and institutional capital. Check loan eligibility, explore government subsidies, and get investment ready.',
};

import { setRequestLocale } from 'next-intl/server';

export default async function FinancialConnectPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Financial Connect Hub",
    "provider": {
      "@type": "Organization",
      "name": "MSME 360",
      "url": "https://msme360.in"
    },
    "description": "Financial eligibility simulation and subsidy matching for Indian MSMEs.",
    "serviceType": "Financial Advisory",
    "areaServed": "IN",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "MSME Financial Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Loan Eligibility Simulator"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Government Scheme Matching"
          }
        }
      ]
    }
  };

  return (
    <>
      <Script
        id="finance-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FinancialConnectClient />
    </>
  );
}
