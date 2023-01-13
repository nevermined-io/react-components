import { NeverminedOptions, Logger } from '@nevermined-io/nevermined-sdk-js'
import { AuthToken } from '../src'
import path from 'path'
import { ethers } from 'ethers'

const neverminedNodeAddress = process.env.NEVERMINED_NODE_ADDRESS || '0x068ed00cf0441e4829d9784fcbe7b9e26d4bd8d0'
const neverminedNodeUri = process.env.NEVERMINED_NODE_URI || 'http://node.nevermined.localnet'
const marketplaceUri = process.env.MARKETPLACE_URI || 'http://marketplace.nevermined.localnet'
const web3ProviderUri = process.env.WEB3_PROVIDER_URI || `http://contracts.nevermined.localnet`
const graphHttpUri = process.env.GRAPH_HTTP_URI ||  'https://api.thegraph.com/subgraphs/name/nevermined-io/common'

export const walletAddress = process.env.WALLET_ADDRESS || '0xe2DD09d719Da89e5a3D0F2549c7E24566e947260'
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
  artifactsFolder: path.join(__dirname, '../artifacts')
}
