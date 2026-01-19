/**
 * 🌍 i18n CONFIGURATION
 * Configuration de next-intl pour le support multilingue
 */

import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Langues supportées
export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];

// Langue par défaut
export const defaultLocale: Locale = 'fr';

// Sports supportés
export const sports = ['aikido'] as const;
export type Sport = (typeof sports)[number];

// Validation des locales
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

// Validation des sports
export function isValidSport(sport: string): sport is Sport {
  return sports.includes(sport as Sport);
}

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!isValidLocale(locale)) notFound();

  // Load core translations
  const coreMessages = (await import(`./locales/core/${locale}.json`)).default;
  
  return {
    messages: coreMessages,
    timeZone: 'Europe/Paris',
    now: new Date(),
  };
});
