import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/settings';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export default async function proxy(request: NextRequest) {
  // 1. First, create a base response from next-intl
  let response = intlMiddleware(request);

  // 2. Initialize Supabase client with the ability to modify the existing response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Update the already created intl response with new cookies
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 3. Refresh session / Get user
  // getUser() automatically calls getSession() and refreshes it if needed
  const { data: { user } } = await supabase.auth.getUser();

  // 4. Protect routes
  const pathname = request.nextUrl.pathname;
  
  // Dashboard routes protection
  const isDashboardPath = pathname === '/dashboard' || pathname.startsWith('/dashboard/') ||
                         locales.some(locale => pathname === `/${locale}/dashboard` || pathname.startsWith(`/${locale}/dashboard/`));

  // Auth pages protection (redirect logged-in users away)
  const isAuthPath = pathname === '/login' || pathname.startsWith('/login/') ||
                    pathname === '/register' || pathname.startsWith('/register/') ||
                    pathname === '/auth/callback' || pathname.startsWith('/auth/callback/') ||
                    locales.some(locale => pathname === `/${locale}/login` || pathname.startsWith(`/${locale}/login/`) ||
                                          pathname === `/${locale}/register` || pathname.startsWith(`/${locale}/register/`) ||
                                          pathname === `/${locale}/auth/callback` || pathname.startsWith(`/${locale}/auth/callback/`));

  // Redirect to login if accessing dashboard while logged out
  if (isDashboardPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login'; 
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if accessing auth pages while logged in
  if (isAuthPath && user) {
    // Only redirect if NOT on the callback page, as callback might need to finish code exchange
    // But actually, if user is already established, we can go to dashboard
    if (!pathname.includes('/auth/callback')) {
      const url = request.nextUrl.clone();
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|webmanifest|xml|txt)$).*)',
  ],
};
