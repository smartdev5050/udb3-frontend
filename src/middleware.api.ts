import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const middleware = (request: NextRequest) => {
  const shouldHideBetaVersion =
    process.env.NEXT_PUBLIC_SHOULD_SHOW_BETA_VERSION !== 'true';

  const hasSeenConversionPage =
    request.cookies.get('has_seen_beta_conversion_page') === 'true';

  if (shouldHideBetaVersion || hasSeenConversionPage) return;

  const url = new URL('/beta-version', request.url);
  return NextResponse.redirect(url);
};

export const config = {
  matcher: '/event',
};
