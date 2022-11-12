/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest/presets/default-esm",
  verbose: true,
  testEnvironment: "jsdom",
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  setupFilesAfterEnv: ["<rootDir>/tests/jest-setup.ts"],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.m?[tj]sx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
}
