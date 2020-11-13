module.exports = {
  stories: ['../src/components/publiq-ui/**/*.stories.mdx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  env: {
    API_KEY: process.env.API_KEY,
    API_URL: process.env.API_URL,
    LEGACY_APP_URL: process.env.LEGACY_APP_URL,
    AUTH_URL: process.env.AUTH_URL,
    SOCKET_URL: process.env.SOCKET_URL,
    NEW_FEATURES_URL: process.env.NEW_FEATURES_URL,
    ENV_NAME: process.env.ENV_NAME,
  },
};
