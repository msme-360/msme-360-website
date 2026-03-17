import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './settings';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  // Ensure we have a valid locale string
  const currentLocale = (locale && locales.includes(locale as any)) ? (locale as string) : (defaultLocale as string);

  // Static mapping for reliability in build/production environments
  const messageImports: Record<string, () => Promise<any>> = {
    en: () => import('../messages/en.json'),
    hi: () => import('../messages/hi.json'),
  };

  const messages = (await messageImports[currentLocale]()).default;

  return {
    locale: currentLocale,
    messages
  };
});
