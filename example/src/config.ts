import { Config } from '@nevermined-io/nevermined-sdk-js';
import Web3 from 'web3';
import Catalog from '@nevermined-io/catalog-core';

export const serviceUri =
  process.env.REACT_APP_SERVICE_URI ||
  'https://autonomies-backend.autonomies.staging.nevermined.rocks';
export const metadataUri =
  process.env.REACT_APP_METADATA_URI || 'https://metadata.autonomies.staging.nevermined.rocks'; // 'http://localhost:5000'
export const gatewayAddress =
  process.env.REACT_APP_GATEWAY_ADDRESS || '0xe63a11dC61b117D9c2B1Ac8021d4cffEd8EC213b';
export const gatewayUri =
  process.env.REACT_APP_GATEWAY_URI || 'https://gateway.autonomies.pre.nevermined.rocks';
export const faucetUri =
  process.env.REACT_APP_FAUCET_URI || 'https://faucet.autonomies.staging.nevermined.rocks';
export const acceptedChainId = process.env.REACT_APP_ACCEPTED_CHAIN_ID || '80001'; // for Mumbai
export const rootUri = process.env.REACT_APP_ROOT_URI || 'http://localhost:3445';
export const marketplaceUri = 'https://marketplace-api.autonomies.pre.nevermined.rocks';

export const appConfig: Config = {
  //@ts-ignore
  web3Provider: new Web3(window.ethereum),
  gatewayUri,
  faucetUri,
  verbose: true,
  gatewayAddress,
  marketplaceAuthToken: Catalog.fetchMarketplaceApiTokenFromLocalStorage().token,
  marketplaceUri,
  artifactsFolder: `${rootUri}/contracts`
};

//
// export const nodeUri =
//   process.env.REACT_APP_NODE_URI ||
//   'https://polygon-mumbai.infura.io/v3/eda048626e2745b182f43de61ac70be1';
//export const marketplaceUri = 'https://metadata.auto-nvm2.nevermined.rocks';
