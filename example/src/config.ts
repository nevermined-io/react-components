import { Config } from '@nevermined-io/nevermined-sdk-js';
import Catalog from 'test-catalog-core';
import { ethers } from 'ethers';

export const gatewayAddress =
  process.env.REACT_APP_GATEWAY_ADDRESS || '0x5838B5512cF9f12FE9f2beccB20eb47211F9B0bc';
export const gatewayUri =
  process.env.REACT_APP_GATEWAY_URI || 'https://defi.v2.gateway.mumbai.nevermined.rocks';
export const faucetUri =
  process.env.REACT_APP_FAUCET_URI || 'https://faucet.rinkeby.nevermined.rocks';
export const acceptedChainId = process.env.REACT_APP_ACCEPTED_CHAIN_ID || '80001'; // for Mumbai
export const rootUri = process.env.REACT_APP_ROOT_URI || 'http://localhost:3445';
export const marketplaceUri = 'https://defi.v2.marketplace-api.mumbai.nevermined.rocks';

export const appConfig: Config = {
  //@ts-ignore
  web3Provider: typeof window !== 'undefined' ? window.ethereum : new ethers.providers.JsonRpcProvider(nodeUri),
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
