/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/jest-setup.ts'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['ts-jest'],
  },
  transformIgnorePatterns: ['/node_modules/(?!connectkit)'],
}
