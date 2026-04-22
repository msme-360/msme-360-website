import { locales } from '@/i18n/settings';
import { setRequestLocale } from 'next-intl/server';
import AboutClient from './AboutClient';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutClient />;
}
