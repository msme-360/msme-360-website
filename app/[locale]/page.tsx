import { locales } from '@/i18n/settings';
import LandingClient from './LandingClient';
import { setRequestLocale } from 'next-intl/server';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Page({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  return <LandingClient />;
}
