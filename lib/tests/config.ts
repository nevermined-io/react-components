import { Config } from '@nevermined-io/nevermined-sdk-js';
import { ethers } from 'ethers';
import Catalog from '../src';

export const serviceUri = 'https://autonomies-backend.autonomies.staging.nevermined.rocks';
export const metadataUri = 'https://metadata.autonomies.staging.nevermined.rocks';
export const gatewayAddress = '0xe63a11dC61b117D9c2B1Ac8021d4cffEd8EC213b';
export const gatewayUri = 'https://gateway.autonomies.pre.nevermined.rocks';
export const faucetUri = 'https://faucet.autonomies.staging.nevermined.rocks';
export const acceptedChainId = '80001';
export const rootUri = 'http://localhost:3445';
export const marketplaceUri = 'https://marketplace-api.autonomies.pre.nevermined.rocks';

export const appConfig: Config = {
  web3Provider:
    typeof window !== 'undefined' ? window.ethereum : new ethers.providers.JsonRpcProvider(rootUri),
  gatewayUri,
  faucetUri,
  verbose: true,
  gatewayAddress,
  marketplaceAuthToken: Catalog.fetchMarketplaceApiTokenFromLocalStorage().token,
  marketplaceUri,
  artifactsFolder: `${rootUri}/contracts`
};
