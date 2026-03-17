import { Metadata } from 'next';
import HelpCenterClient from './HelpCenterClient';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'Support Center | MSME 360',
  description: 'Get answers to common FAQ about Udyam registration, DPIIT Startup India, and MSME loans. Chat with experts and scale your business.',
};

export default function HelpCenterPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do I need to pay for Udyam registration?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, Udyam registration is completely free of cost. MSME360 provides guided flows for the official government portal."
        }
      },
      {
        "@type": "Question",
        "name": "How long does DPIIT recognition take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Typically, it takes 2-4 weeks after submission. MSME360 helps you ensure your documentation is 'recognition-ready' before you apply."
        }
      },
      {
        "@type": "Question",
        "name": "What is the benefit of the Loan Eligibility Simulator?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "It allows you to understand your credit-readiness based on real business metrics (GST, Revenue, Age) before approaching a bank, increasing your chances of approval."
        }
      }
    ]
  };

  return (
    <>
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HelpCenterClient />
    </>
  );
}
