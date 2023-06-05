const JsConfigPathsMapper = require('jsconfig-paths-jest-mapper');
const jsconfigpaths = new JsConfigPathsMapper({
  configFileName: 'tsconfig.json',
});

module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  modulePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/src/test/e2e',
  ],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    ...jsconfigpaths,
  },
};
