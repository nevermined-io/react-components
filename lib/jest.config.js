/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  verbose: false,
  preset: 'ts-jest',
  testTimeout: 100000,
  testEnvironment: 'jsdom',
  setupFiles: ['jest-localstorage-mock'],
  setupFilesAfterEnv: ['<rootDir>/unit-tests/jest-setup.ts'],
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!jose)'],
  transform: {
    '^.+\\.[tj]s$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      tsconfig: {
        allowJs: true
      }
    }
  }
};
