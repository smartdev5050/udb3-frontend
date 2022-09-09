const nextConfig = require('../next.config.js');
const tsConfig = require('../tsconfig.json');
const path = require('path');

const paths = Object.entries(tsConfig.compilerOptions.paths).reduce(
  (acc, [key, val]) => {
    const parsedPath = val[0].split('/*')[0];

    return {
      ...acc,
      [key.split('/*')[0]]: path.resolve(__dirname, `../src/${parsedPath}`),
    };
  },
  {},
);

// .storybook/main.js

// Export a function. Accept the base config as the only param.
module.exports = {
  ...nextConfig,
  stories: ['../src/ui/**/*.stories.mdx'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  core: {
    builder: 'webpack5',
  },
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push({
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'sass-loader'],
      include: path.resolve(__dirname, '../'),
    });

    config.resolve.alias = {
      ...config.resolve.alias,
      ...paths,
    };

    config.resolve.fallback = {
      ...config.resolve.alias,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    };

    // Return the altered config
    return config;
  },
};
