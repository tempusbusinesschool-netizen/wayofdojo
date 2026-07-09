import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  
  // Used when no locale matches
  defaultLocale,
  
  // Prefix the default locale
  localePrefix: 'always',
});

export const config = {
  // Match all pathnames except for
  // - API routes
  // - next-api routes (for preview environment)
  // - Static files
  // - _next (Next.js internals)
  matcher: [
    '/((?!api|next-api|_next|_vercel|.*\\..*).*)',
    // Match all locale-prefixed paths
    '/(fr|en)/:path*',
  ],
};
