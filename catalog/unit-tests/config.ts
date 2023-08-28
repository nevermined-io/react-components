import { NeverminedOptions } from '@nevermined-io/sdk'

const neverminedNodeAddress =
  process.env.NEVERMINED_NODE_ADDRESS || '0x5838B5512cF9f12FE9f2beccB20eb47211F9B0bc'
const neverminedNodeUri =
  process.env.NEVERMINED_NODE_URI || 'https://node.mumbai.public.nevermined.network'
const marketplaceUri =
  process.env.MARKETPLACE_URI || 'https://marketplace-api.mumbai.public.nevermined.network'
const graphHttpUri =
  process.env.GRAPH_HTTP_URI || 'https://api.thegraph.com/subgraphs/name/nevermined-io/common'

export const appConfig: NeverminedOptions = {
  web3Provider: undefined,
  neverminedNodeUri,
  verbose: true,
  neverminedNodeAddress,
  graphHttpUri,
  marketplaceUri,
}
