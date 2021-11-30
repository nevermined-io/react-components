import { Config } from '@nevermined-io/nevermined-sdk-js';

const defaultConfig = {
  metadataUri: 'http://localhost:5000',
  gatewayUri: 'http://localhost:8030',
  faucetUri: 'http://localhost:3001',
  nodeUri: `http://localhost:${process.env.ETH_PORT || 8545}`,
  parityUri: 'http://localhost:9545',
  secretStoreUri: 'http://localhost:12001',
  gatewayAddress: '0x068ed00cf0441e4829d9784fcbe7b9e26d4bd8d0',
  verbose: true,

} as Config;

const config = {
  neverminedConfig: defaultConfig,
  isBurnerWalletEnabled: "false"
};

export default config;
