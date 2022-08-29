import { Config } from '@nevermined-io/nevermined-sdk-js';
import { AuthToken } from '../src';

const gatewayAddress = process.env.GATEWAY_ADDRESS || '0x5838B5512cF9f12FE9f2beccB20eb47211F9B0bc';
const gatewayUri = process.env.GATEWAY_URI || 'https://defi.v2.gateway.mumbai.nevermined.rocks';
const faucetUri = process.env.FAUCET_URI || 'https://faucet.rinkeby.nevermined.rocks';
const marketplaceUri = process.env.MARKETPLACE_URI || 'https://defi.v2.marketplace-api.mumbai.nevermined.rocks';

export const appConfig: Config = {
  web3Provider: undefined,
  gatewayUri,
  faucetUri,
  verbose: true,
  gatewayAddress,
  marketplaceAuthToken: AuthToken.fetchMarketplaceApiTokenFromLocalStorage().token,
  marketplaceUri,
};
