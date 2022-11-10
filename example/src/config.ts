import { Config } from '@nevermined-io/nevermined-sdk-js';
import { AuthToken } from '@nevermined-io/catalog-core';
import { ethers } from 'ethers';

export const gatewayAddress =
  process.env.REACT_APP_GATEWAY_ADDRESS || '0x5838B5512cF9f12FE9f2beccB20eb47211F9B0bc';
export const gatewayUri =
  process.env.REACT_APP_GATEWAY_URI || 'https://gateway.mumbai.public.nevermined.network';
export const acceptedChainId = process.env.REACT_APP_ACCEPTED_CHAIN_ID || '80001'; // for Mumbai
export const rootUri = process.env.REACT_APP_ROOT_URI || 'http://localhost:3445';
export const marketplaceUri =  process.env.REACT_APP_MARKETPLACE_API || 'https://marketplace-api.mumbai.public.nevermined.network'
const graphHttpUri = process.env.GRAPH_HTTP_URI ||  'https://api.thegraph.com/subgraphs/name/nevermined-io/public';
export const erc20TokenAddress = process.env.ERC20_TOKEN_ADDRESS || '0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e';
export const nodeUri = process.env.REACT_APP_NODE_URI || 'https://matic-mumbai.chainstacklabs.com'

export const appConfig: Config = {
  //@ts-ignore
  web3Provider: typeof window !== 'undefined' ? window.ethereum : new ethers.providers.JsonRpcProvider(nodeUri),
  gatewayUri,
  verbose: 2,
  gatewayAddress,
  graphHttpUri,
  marketplaceAuthToken: AuthToken.fetchMarketplaceApiTokenFromLocalStorage().token,
  marketplaceUri,
  artifactsFolder: `${rootUri}/contracts`,
  newGateway: true,
};

