module.exports = {
  future: {
    webpack5: true,
  },
  stories: ['../src/ui/**/*.stories.mdx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
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
    sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    newsletterApiUrl: process.env.NEXT_PUBLIC_NEWSLETTER_API_URL,
    newsletterEmailListId: process.env.NEXT_PUBLIC_NEWSLETTER_EMAIL_LIST_ID,
  },
};
