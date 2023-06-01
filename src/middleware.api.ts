import { getSession } from '@auth0/nextjs-auth0/edge';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { defaultCookieOptions } from './hooks/useCookiesWithOptions';

export const middleware = async (request: NextRequest) => {
  if (request.nextUrl.pathname.startsWith('/login')) {
    try {
      const referer = request.cookies.get('auth0.redirect_uri');
      const response = NextResponse.redirect(referer);
      const { accessToken } = await getSession(request, response);
      response.cookies.set('token', accessToken, defaultCookieOptions);
      response.cookies.set('auth0.redirect_uri', '', { maxAge: 0 });
      return response;
    } catch (err) {
      const response = NextResponse.next();
      response.cookies.set('auth0.redirect_uri', '', { maxAge: 0 });
      return response;
    }
  }

  if (request.nextUrl.pathname.startsWith('/event')) {
    const shouldHideBetaVersion =
      process.env.NEXT_PUBLIC_SHOULD_SHOW_BETA_VERSION !== 'true';

    const hasSeenConversionPage =
      request.cookies.get('has_seen_beta_conversion_page') === 'true';

    if (shouldHideBetaVersion || hasSeenConversionPage) return;

    const url = new URL('/beta-version', request.url);
    return NextResponse.redirect(url);
  }
};

export const config = {
  matcher: ['/event', '/login'],
};
