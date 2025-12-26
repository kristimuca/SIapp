module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    '*.js',
    '!server.js',
    '!jest.config.js',
    '!coverage/**'
  ],
  testMatch: ['**/*.test.js'],
  verbose: true
};
