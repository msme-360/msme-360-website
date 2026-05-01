import { locales } from '@/i18n/settings';
import { setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import CategoryRolesClient from './CategoryRolesClient';
import { getCareerRoles } from '../actions';
import { Skeleton } from '@/components/ui/skeleton';
import { CAREER_ROLES } from '@/lib/roles';

function RolesSkeleton() {
  return (
    <div className="pt-32 pb-20 px-4 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  const params: { locale: string; category: string }[] = [];
  locales.forEach(locale => {
    params.push({ locale, category: 'internships' });
    params.push({ locale, category: 'full-time' });
  });
  return params;
}

export default async function CategoryPage({
  params
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category } = await params;
  setRequestLocale(locale);

  const type = category === 'internships' ? 'internship' : 'job';
  const dbRoles = await getCareerRoles(type);
  
  // Merge with static roles
  const staticRoles = CAREER_ROLES.filter(r => r.type === type && r.slug !== 'general');
  
  const mergedRoles = staticRoles.map(sr => {
    const dbRole = dbRoles.find(dr => dr.slug === sr.slug);
    // Omit the icon component here as it cannot be serialized
    const { ...staticRest } = sr;
    return {
      ...staticRest,
      ...dbRole
    };
  });

  return (
    <Suspense fallback={<RolesSkeleton />}>
      <CategoryRolesClient roles={mergedRoles} category={category} />
    </Suspense>
  );
}
