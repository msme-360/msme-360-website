import { locales } from '@/i18n/settings';
import { setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import CareersClient from './CareersClient';
import { Skeleton } from '@/components/ui/skeleton';

function CareersSkeleton() {
  return (
    <div className="pt-32 pb-20 px-4 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <Skeleton className="h-6 w-32 mx-auto rounded-full" />
          <Skeleton className="h-16 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {[1, 2].map((i) => (
            <div key={i} className="h-[280px] rounded-3xl bg-white/5 border border-white/10 p-8 space-y-6">
              <Skeleton className="w-16 h-16 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-16 w-full" />
              </div>
              <Skeleton className="h-6 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function CareersPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  return (
    <Suspense fallback={<CareersSkeleton />}>
      <CareersClient />
    </Suspense>
  );
}
