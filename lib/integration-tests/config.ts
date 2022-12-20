import { NeverminedOptions, Logger } from '@nevermined-io/nevermined-sdk-js'
import { AuthToken } from '../src'
import path from 'path'
import { ethers } from 'ethers'

const infuraToken = process.env.INFURA_TOKEN
const neverminedNodeAddress = process.env.NEVERMINED_NODE_ADDRESS || '0x5838B5512cF9f12FE9f2beccB20eb47211F9B0bc'
const neverminedNodeUri = process.env.NEVERMINED_NODE_URI || 'https://node.mumbai.public.nevermined.network'
const marketplaceUri = process.env.MARKETPLACE_URI || 'https://marketplace-api.mumbai.public.nevermined.network'
const web3ProviderUri = process.env.WEB3_PROVIDER_URI || `https://polygon-mumbai.infura.io/v3/${infuraToken}`
const graphHttpUri = process.env.GRAPH_HTTP_URI ||  'https://api.thegraph.com/subgraphs/name/nevermined-io/common'

export const walletAddress = process.env.WALLET_ADDRESS || '0xF91d149BE554304DDD391937f9DcF57341cFAf02'
export const did = process.env.DID || '0x1643dfa34b8693abd5c0e9947bcd32b68f7e1f2b763744e1f7c2ba32fb84e46a'

Logger.setLevel(3)

export const appConfig: NeverminedOptions = {
  web3Provider: typeof window !== 'undefined' ? (window as any).ethereum : new ethers.providers.JsonRpcProvider(web3ProviderUri),
  web3ProviderUri,
  neverminedNodeUri,
  graphHttpUri,
  verbose: true,
  neverminedNodeAddress,
  marketplaceAuthToken: AuthToken.fetchMarketplaceApiTokenFromLocalStorage().token,
  marketplaceUri,
  artifactsFolder: path.join(__dirname, '/artifacts')
}
