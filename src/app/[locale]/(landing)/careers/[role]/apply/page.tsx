import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { CAREER_ROLES } from '@/lib/roles';
import ApplyClient from './ApplyClient';

export function generateStaticParams() {
  const params: { locale: string; role: string }[] = [];
  ['en', 'hi'].forEach(locale => {
    CAREER_ROLES.forEach(role => {
      params.push({ locale, role: role.slug });
    });
  });
  return params;
}

export default async function ApplyPage(props: { params: Promise<{ locale: string; role: string }> }) {
  const { locale, role: roleSlug } = await props.params;
  setRequestLocale(locale);

  const role = CAREER_ROLES.find((r) => r.slug === roleSlug);

  if (!role) {
    notFound();
  }

  return <ApplyClient roleSlug={roleSlug} />;
}
