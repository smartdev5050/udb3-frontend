const nextConfig = require('../next.config.js');
const jsonConfig = require('../jsconfig.json');
const path = require('path');

const paths = Object.entries(jsonConfig.compilerOptions.paths).reduce(
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

    // Return the altered config
    return config;
  },
};
