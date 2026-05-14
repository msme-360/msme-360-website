import { locales } from '@/i18n/settings';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { CareerRole, CAREER_ROLES } from '@/lib/roles';
import RoleDetailClient from './RoleDetailClient';
import { getCareerRole } from '../../actions';

export async function generateStaticParams() {
  const params: { locale: string; category: string; role: string }[] = [];
  locales.forEach(locale => {
    CAREER_ROLES.forEach(role => {
      const categorySlug = role.type === 'internship' ? 'internships' : 'full-time';
      params.push({ locale, category: categorySlug, role: role.slug });
    });
  });
  return params;
}

export default async function RolePage({
  params
}: {
  params: Promise<{ locale: string; category: string; role: string }>;
}) {
  const { locale, role } = await params;
  setRequestLocale(locale);

  const dbRole = await getCareerRole(role);
  const staticRole = CAREER_ROLES.find(r => r.slug === role);
  
  if (!dbRole && !staticRole) notFound();

  // Merge DB data into static role if available
  const staticRest = { ...(staticRole || {}) } as Partial<CareerRole>;
  delete staticRest.icon;
  const roleData = {
    ...staticRest,
    ...dbRole,
  };

  return <RoleDetailClient roleData={roleData} />;
}
