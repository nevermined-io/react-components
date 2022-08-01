import { Config } from '@nevermined-io/nevermined-sdk-js';
import { ethers } from 'ethers';
import Catalog from '../src';

const gatewayAddress = '0xe63a11dC61b117D9c2B1Ac8021d4cffEd8EC213b';
const gatewayUri = 'https://gateway.autonomies.pre.nevermined.rocks';
const faucetUri = 'https://faucet.autonomies.staging.nevermined.rocks';
const rootUri = 'http://localhost:3445';
const marketplaceUri = 'https://marketplace-api.autonomies.pre.nevermined.rocks';

export const appConfig: Config = {
  web3Provider: undefined,
  gatewayUri,
  faucetUri,
  verbose: true,
  gatewayAddress,
  marketplaceAuthToken: Catalog.fetchMarketplaceApiTokenFromLocalStorage().token,
  marketplaceUri,
  artifactsFolder: `${rootUri}/contracts`
};
