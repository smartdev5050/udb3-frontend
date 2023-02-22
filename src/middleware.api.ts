import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const middleware = (request: NextRequest) => {
  const hasSeenConversionPage =
    request.cookies.get('has_seen_conversion_page') === 'true';

  if (!hasSeenConversionPage) {
    const url = new URL('/beta-version', request.url);
    return NextResponse.redirect(url);
  }
};

export const config = {
  matcher: '/event',
};
