import { Metadata } from 'next';
import MicroAIHubClient from './MicroAIHubClient';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'MicroAI Hub | MSME 360',
  description: 'AI-powered microservices for business growth. Demand forecasting, AI NIC finder, Startup India eligibility, and neural invoice OCR.',
};

import { setRequestLocale } from 'next-intl/server';

export default async function MicroAIHubPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<div className="py-20 text-center opacity-50 italic">Loading Growth Engine...</div>}>
      <MicroAIHubClient />
    </Suspense>
  );
}
