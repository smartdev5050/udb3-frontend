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
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    legacyAppUrl: process.env.NEXT_PUBLIC_LEGACY_APP_URL,
    authUrl: process.env.NEXT_PUBLIC_AUTH_URL,
    socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL,
    newAnnouncementsUrl: process.env.NEXT_PUBLIC_NEW_ANNOUNCEMENTS_URL,
    taxonomyUrl: process.env.NEXT_PUBLIC_TAXONOMY_URL,
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    newsletterApiUrl: process.env.NEXT_PUBLIC_NEWSLETTER_API_URL,
    newsletterEmailListId: process.env.NEXT_PUBLIC_NEWSLETTER_EMAIL_LIST_ID,
    globalAlertMessage: process.env.NEXT_PUBLIC_GLOBAL_ALERT_MESSAGE,
    globalAlertVariant: process.env.NEXT_PUBLIC_GLOBAL_ALERT_VARIANT,
  },
  pageExtensions: ['page.tsx', 'page.js', 'api.ts'],
};

const SentryWebpackPluginOptions = {
  dryRun: true,
};

module.exports = withSentryConfig(moduleExports, SentryWebpackPluginOptions);
