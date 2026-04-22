import { Metadata } from 'next';
import MicroAIHubClient from './MicroAIHubClient';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function MicroAIHubSkeleton() {
  return (
    <div className="space-y-12 py-10">
      {/* Hero Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-6 w-96 max-w-full" />
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-full" />
        ))}
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-64 rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-16 w-full" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
    <Suspense fallback={<MicroAIHubSkeleton />}>
      <MicroAIHubClient />
    </Suspense>
  );
}
