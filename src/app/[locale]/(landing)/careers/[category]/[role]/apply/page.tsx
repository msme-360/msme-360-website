import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { CareerRole, CAREER_ROLES } from '@/lib/roles';
import ApplyClient from './ApplyClient';
import { getCareerRole } from '../../../actions';

export function generateStaticParams() {
  const params: { locale: string; category: string; role: string }[] = [];
  ['en', 'hi'].forEach(locale => {
    CAREER_ROLES.forEach(role => {
      const categorySlug = role.type === 'internship' ? 'internships' : 'full-time';
      params.push({ locale, category: categorySlug, role: role.slug });
    });
  });
  return params;
}

export default async function ApplyPage(props: { params: Promise<{ locale: string; category: string; role: string }> }) {
  const { locale, role: roleSlug } = await props.params;
  setRequestLocale(locale);

  const dbRole = await getCareerRole(roleSlug);
  const staticRole = CAREER_ROLES.find((r) => r.slug === roleSlug);

  if (!dbRole && !staticRole) {
    notFound();
  }

  // Merge DB data into static role if available
  // Omit icon component as it cannot be serialized
  const staticRest = { ...(staticRole || {}) } as Partial<CareerRole>;
  delete staticRest.icon;
  const roleData = {
    ...staticRest,
    ...dbRole,
  };

  return <ApplyClient roleSlug={roleSlug} initialRoleData={roleData} />;
}
