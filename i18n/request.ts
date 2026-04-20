import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './settings';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  // Ensure we have a valid locale string
  const currentLocale = (locale && locales.includes(locale as (typeof locales)[number])) ? (locale as string) : (defaultLocale as string);

  // Modular segments to aggregate
  const modules = [
    'common',
    'auth',
    'microai',
    'financial',
    'help',
    'community',
    'profile',
    'settings',
    'operations',
    'landing',
    'formalization',
    'dashboard',
    'navigation',
    'footer',
    'gtm',
    'about',
    'careers',
    'admin',
    'internal',
    'pricing'
  ];

  const messages = {};

  // Aggregate all modules for the current locale
  for (const segment of modules) {
    try {
      const mod = (await import(`../messages/${currentLocale}/${segment}.json`)).default;
      Object.assign(messages, mod);
    } catch {
      // Silently skip missing modules - useful for incrementally adding new translations
      // like about.json, careers.json etc.
    }
  }

  return {
    locale: currentLocale,
    messages
  };
});
