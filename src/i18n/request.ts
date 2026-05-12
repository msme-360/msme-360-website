import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale } from './settings';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  // Ensure we have a valid locale string
  const currentLocale = (locale && locales.includes(locale as (typeof locales)[number])) ? (locale as string) : (defaultLocale as string);

  // Modular segments to aggregate
  const modules = [
    'common',
    'navigation',
    'dashboard',
    'auth',
    'formalization',
    'operations',
    'gtm',
    'microai',
    'profile',
    'settings',
    'community',
    'financial',
    'landing',
    'footer',
    'about',
    'help',
    'admin',
    'internal',
    'pricing',
    'hiring',
    'careers'
  ];

  const messages: Record<string, unknown> = {};

  // Aggregate all modules for the current locale with deep merge to prevent namespace overwriting
  for (const segment of modules) {
    try {
      const mod = (await import(`./messages/${currentLocale}/${segment}.json`)).default;
      
      // Deep merge logic
      for (const key in mod) {
        if (typeof mod[key] === 'object' && mod[key] !== null && !Array.isArray(mod[key])) {
          messages[key] = { ...(messages[key] || {}), ...mod[key] };
        } else {
          messages[key] = mod[key];
        }
      }
    } catch (error) {
      console.error(`[i18n] Failed to load module ${segment} for locale ${currentLocale}:`, error);
    }
  }

  return {
    locale: currentLocale,
    messages
  };
});
