import { Config, Logger } from '@nevermined-io/nevermined-sdk-js';
import { AuthToken } from '../src';
import path from 'path';
import { ethers } from 'ethers';

// const infuraToken = process.env.INFURA_TOKEN;
const gatewayAddress = process.env.GATEWAY_ADDRESS || '0x5838B5512cF9f12FE9f2beccB20eb47211F9B0bc';
const gatewayUri = process.env.GATEWAY_URI || 'https://defi.v2.gateway.mumbai.nevermined.rocks';
const faucetUri = process.env.FAUCET_URI || 'https://faucet.rinkeby.nevermined.rocks';
const marketplaceUri = process.env.MARKETPLACE_URI || 'https://defi.v2.marketplace-api.mumbai.nevermined.rocks';
const nodeUri = process.env.NODE_URI || `https://polygon-mumbai.g.alchemy.com/v2/zhfk2feJ5xmreYaRHGx_HPdxcmOa1f9e`;
const graphHttpUri = process.env.GRAPH_HTTP_URI ||  'https://api.thegraph.com/subgraphs/name/nevermined-io/common';

export const walletAddress = process.env.WALLET_ADDRESS || '0xF91d149BE554304DDD391937f9DcF57341cFAf02';

Logger.setLevel(3)

export const appConfig: Config = {
  web3Provider: typeof window !== 'undefined' ? (window as any).ethereum : new ethers.providers.JsonRpcProvider(nodeUri),
  nodeUri: nodeUri,
  gatewayUri,
  graphHttpUri,
  faucetUri,
  verbose: true,
  gatewayAddress,
  marketplaceAuthToken: AuthToken.fetchMarketplaceApiTokenFromLocalStorage().token,
  marketplaceUri,
  artifactsFolder: path.join(__dirname, '/artifacts')
};
