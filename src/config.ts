import { Config } from '@nevermined-io/nevermined-sdk-js';


//
// marketplace-server connection
//
export const serviceUri = process.env.REACT_APP_SERVICE_URI || 'http://localhost:4000'

//
// NEVERMINED REMOTE CONNECTIONS
//
export const metadataUri = process.env.REACT_APP_METADATA_URI || 'http://metadata:5000'; // 'http://localhost:5000'
export const gatewayAddress = process.env.REACT_APP_GATEWAY_ADDRESS || '0x068ed00cf0441e4829d9784fcbe7b9e26d4bd8d0'
export const gatewayUri = process.env.REACT_APP_GATEWAY_URI || 'http://localhost:8030'
export const faucetUri = process.env.REACT_APP_FAUCET_URI || 'http://localhost:3001'
export const nodeUri = process.env.REACT_APP_NODE_URI || 'http://localhost:8545'
export const secretStoreUri = process.env.REACT_APP_SECRET_STORE_URI || 'http://localhost:12001'
export const parityUri = process.env.REACT_APP_PARITY_URI || 'http://localhost:9545';
export const shouldUseBurnerWallet = process.env.REACT_APP_BURNER_WALLET_ENABLED || false;

const defaultConfig = {
  metadataUri,
  gatewayUri,
  faucetUri,
  nodeUri,
  parityUri,
  secretStoreUri,
  gatewayAddress,
  verbose: true,

} as Config;

const config = {
  neverminedConfig: defaultConfig,
  shouldUseBurnerWallet
};

export default config;
