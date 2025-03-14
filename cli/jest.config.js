// jest.config.js
export default {
  setupFilesAfterEnv: ['./jest.setup.js'],
  transform: {},
  testEnvironment: 'node',
  // Fix ESM imports by removing the need to add .js extensions
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  testMatch: ["**/*.test.js"],
  collectCoverageFrom: [
    "src/*.js",
    "!src/index.js"
  ],
  coverageReporters: ["text", "lcov"],
  verbose: true,
  moduleFileExtensions: ['js', 'json'],
  testPathIgnorePatterns: ['/node_modules/'],
  transformIgnorePatterns: [],
  // Increase default timeout for tests
  testTimeout: 15000
};