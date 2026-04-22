import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n/settings';
import { STARTUP_ROLES } from './lib/constants/roles';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 1. Identify API routes
  const isApiPath = pathname.startsWith('/api/') || 
                    locales.some(locale => pathname.startsWith(`/${locale}/api/`));

  // 2. Handle localization (Skip for API routes)
  let response: NextResponse;

  if (isApiPath) {
    response = NextResponse.next();
  } else {
    response = intlMiddleware(request);
  }

  // 3. Initialize Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 4. Auth & Protection Logic
  const { data: { user } } = await supabase.auth.getUser();

  // 5. Protect paths
  const isDashboardPath = pathname === '/dashboard' || pathname.startsWith('/dashboard/') ||
                         locales.some(locale => pathname === `/${locale}/dashboard` || pathname.startsWith(`/${locale}/dashboard/`));

  const isAdminPath = pathname === '/admin' || pathname.startsWith('/admin/') ||
                     locales.some(locale => pathname === `/${locale}/admin` || pathname.startsWith(`/${locale}/admin/`));

  const isInternalPath = pathname === '/internal' || pathname.startsWith('/internal/') ||
                        locales.some(locale => pathname === `/${locale}/internal` || pathname.startsWith(`/${locale}/internal/`));

  const isAuthPath = pathname === '/login' || pathname.startsWith('/login/') ||
                    pathname === '/register' || pathname.startsWith('/register/') ||
                    pathname === '/auth/callback' || pathname.startsWith('/auth/callback/') ||
                    locales.some(locale => pathname === `/${locale}/login` || pathname.startsWith(`/${locale}/login/`) ||
                                          pathname === `/${locale}/register` || pathname.startsWith(`/${locale}/register/`) ||
                                          pathname === `/${locale}/auth/callback` || pathname.startsWith(`/${locale}/auth/callback/`));

  const isProtectedPath = isDashboardPath || isAdminPath || isInternalPath;

  // Redirect to login if accessing protected paths while logged out
  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login'; 
    return NextResponse.redirect(url);
  }

  // Redirect to role-specific home if accessing auth pages while logged in
  if (isAuthPath && user) {
    if (!pathname.includes('/auth/callback')) {
      const url = request.nextUrl.clone();
      
      // Fetch role for intelligent middleware redirect
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      
      const role = profile?.role || 'user';
      const roleData = STARTUP_ROLES[role] || STARTUP_ROLES.user;
      const locale = locales.find(l => pathname.startsWith(`/${l}`)) || defaultLocale;
      
      // Industry Grade: Dynamic redirection based on role metadata
      const rawPath = roleData.homePath.replace(/^\/+/, '');
      url.pathname = `/${locale}/${rawPath}`;

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
