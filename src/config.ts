import { Config } from '@nevermined-io/nevermined-sdk-js';


//
// marketplace-server connection
//
export const serviceUri = process.env.REACT_APP_SERVICE_URI || 'https://autonomies-backend.autonomies.staging.nevermined.rocks'

//
// NEVERMINED REMOTE CONNECTIONS
//
export const metadataUri = process.env.REACT_APP_METADATA_URI || 'https://metadata.autonomies.staging.nevermined.rocks'; // 'http://localhost:5000'
export const gatewayAddress = process.env.REACT_APP_GATEWAY_ADDRESS || '0x99f313D8A318168bbea6d9C5000AD9e6fAfAA092'
export const gatewayUri = process.env.REACT_APP_GATEWAY_URI || 'https://gateway.autonomies.staging.nevermined.rocks'
export const faucetUri = process.env.REACT_APP_FAUCET_URI || 'https://faucet.autonomies.staging.nevermined.rocks'
export const nodeUri = process.env.REACT_APP_NODE_URI || 'https://polygon-mumbai.infura.io/v3/eda048626e2745b182f43de61ac70be1'
export const secretStoreUri = process.env.REACT_APP_SECRET_STORE_URI || 'http://localhost:12001'
export const parityUri = process.env.REACT_APP_PARITY_URI || 'http://localhost:9545';

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
  neverminedConfig: defaultConfig
};

export default config;
