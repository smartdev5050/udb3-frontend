const JsConfigPathsMapper = require('jsconfig-paths-jest-mapper');
const jsconfigpaths = new JsConfigPathsMapper({
  configFileName: 'tsconfig.json',
});

module.exports = {
  moduleFileExtensions: ['js', 'json'],
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.(js|ts|tsx)'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    ...jsconfigpaths,
  },
};
