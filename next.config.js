const { withSentryConfig } = require('@sentry/nextjs');

/**
 * @type {import('next').NextConfig}
 */
const moduleExports = {
  productionBrowserSourceMaps: true,
  swcMinify: true,
  async redirects() {
    // Redirects to fix non-existing paths should go in `src/redirects.js`!!!
    const env = process.env.NEXT_PUBLIC_ENVIRONMENT;
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: env !== 'development',
      },
    ];
  },
  publicRuntimeConfig: {
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    auth0Domain: process.env.NEXT_PUBLIC_AUTH0_DOMAIN,
    legacyAppUrl: process.env.NEXT_PUBLIC_LEGACY_APP_URL,
    authUrl: process.env.NEXT_PUBLIC_AUTH_URL,
    socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL,
    newAnnouncementsUrl: process.env.NEXT_PUBLIC_NEW_ANNOUNCEMENTS_URL,
    taxonomyUrl: process.env.NEXT_PUBLIC_TAXONOMY_URL,
    cultuurKuurLocationId: process.env.NEXT_PUBLIC_CULTUURKUUR_LOCATION_ID,
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    newsletterApiUrl: process.env.NEXT_PUBLIC_NEWSLETTER_API_URL,
    newsletterEmailListId: process.env.NEXT_PUBLIC_NEWSLETTER_EMAIL_LIST_ID,
    globalAlertMessage: process.env.NEXT_PUBLIC_GLOBAL_ALERT_MESSAGE,
    globalAlertVariant: process.env.NEXT_PUBLIC_GLOBAL_ALERT_VARIANT,
    shouldShowBetaVersion: process.env.NEXT_PUBLIC_SHOULD_SHOW_BETA_VERSION,
    hotjarEventName: process.env.NEXT_PUBLIC_HOTJAR_EVENT_NAME,
    hotjarMissingFieldName: process.env.NEXT_PUBLIC_HOTJAR_MISSING_FIELD_NAME,
  },
  pageExtensions: ['page.tsx', 'page.js', 'api.ts'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

/** @type {Partial<import('@sentry/nextjs').SentryWebpackPluginOptions>} */
const SentryWebpackPluginOptions = {
  silent: true,
  org: 'publiq-vzw',
  project: 'udb3-frontend',
  authToken: process.env.SENTRY_AUTH_TOKEN,
};

module.exports.withoutSentry = moduleExports;

module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions, {
  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Transpiles SDK to be compatible with IE11 (increases bundle size)
  transpileClientSDK: true,

  // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
  tunnelRoute: '/monitoring',

  // Hides source maps from generated client bundles
  hideSourceMaps: false,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,
});
