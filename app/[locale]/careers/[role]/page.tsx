import { locales } from '@/i18n/settings';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { CAREER_ROLES } from '@/lib/roles';
import RoleDetailClient from './RoleDetailClient';

export function generateStaticParams() {
  const params: { locale: string; role: string }[] = [];
  locales.forEach(locale => {
    CAREER_ROLES.forEach(role => {
      params.push({ locale, role: role.slug });
    });
  });
  return params;
}

export default async function RolePage({
  params
}: {
  params: Promise<{ locale: string; role: string }>;
}) {
  const { locale, role: roleSlug } = await params;
  setRequestLocale(locale);

  const roleData = CAREER_ROLES.find(r => r.slug === roleSlug);
  if (!roleData) notFound();
  
  return <RoleDetailClient roleSlug={roleSlug} />;
}
