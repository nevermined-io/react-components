import { Config } from '@nevermined-io/nevermined-sdk-js'
import { AuthToken } from '../src'

const neverminedNodeAddress = process.env.NEVERMINED_NODE_ADDRESS || '0x5838B5512cF9f12FE9f2beccB20eb47211F9B0bc'
const neverminedNodeUri = process.env.NEVERMINED_NODE_URI || 'https://node.mumbai.public.nevermined.network'
const faucetUri = process.env.FAUCET_URI || 'https://faucet.rinkeby.nevermined.rocks'
const marketplaceUri = process.env.MARKETPLACE_URI || 'https://marketplace-api.mumbai.public.nevermined.network'
const graphHttpUri = process.env.GRAPH_HTTP_URI ||  'https://api.thegraph.com/subgraphs/name/nevermined-io/common'

export const appConfig: Config = {
  web3Provider: undefined,
  neverminedNodeUri,
  faucetUri,
  verbose: true,
  neverminedNodeAddress,
  graphHttpUri,
  marketplaceAuthToken: AuthToken.fetchMarketplaceApiTokenFromLocalStorage().token,
  marketplaceUri,
}
