import { locales } from '@/i18n/settings';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { CAREER_ROLES } from '@/lib/roles';
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
  const { locale, role: roleSlug } = await params;
  setRequestLocale(locale);

  const dbRole = await getCareerRole(roleSlug);
  const staticRole = CAREER_ROLES.find(r => r.slug === roleSlug);
  
  if (!dbRole && !staticRole) notFound();

  // Merge DB data into static role if available
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { icon: _, ...staticRest } = (staticRole || {}) as { [key: string]: any };
  const roleData = {
    ...staticRest,
    ...dbRole,
  };

  return <RoleDetailClient roleData={roleData} />;
}
