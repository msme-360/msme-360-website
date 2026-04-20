import { locales } from '@/i18n/settings';
import { setRequestLocale } from 'next-intl/server';
import PricingClient from './PricingClient';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function PricingPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  return <PricingClient />;
}
