/* eslint-disable */
export default {
  displayName: 'provider',
  preset: '../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/tests/jest-setup.ts'],
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/react/babel'] }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../coverage/provider',
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!wagmi|@wagmi/core|@wagmi/chains|@wagmi/connectors|connectkit)'],
};
