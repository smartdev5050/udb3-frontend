module.exports = {
  stories: ['../src/components/publiq-ui/**/*.stories.mdx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
      {
        source: '/login',
        destination: '/login/nl',
        permanent: true,
      },
    ];
  },
};
