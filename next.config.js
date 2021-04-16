const { getRedirects } = require('./src/redirects');

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
    const env = process.env.NEXT_PUBLIC_ENVIRONMENT;
    return getRedirects(env);
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
  },
};
