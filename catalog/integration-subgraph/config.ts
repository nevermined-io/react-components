import { NeverminedOptions, Logger, makeAccounts } from '@nevermined-io/sdk'
import { AuthToken } from '../src'
import path from 'path'
import { ethers } from 'ethers'

const neverminedNodeAddress =
  process.env.NEVERMINED_NODE_ADDRESS || '0x068ed00cf0441e4829d9784fcbe7b9e26d4bd8d0'
const neverminedNodeUri = process.env.NEVERMINED_NODE_URI || 'http://localhost:8030'
const marketplaceUri = process.env.MARKETPLACE_URI || 'http://nevermined-metadata:3100'
const web3ProviderUri = process.env.WEB3_PROVIDER_URI || `http://localhost:8545`
const graphHttpUri =
  process.env.GRAPH_HTTP_URI || 'http://localhost:9000/subgraphs/name/nevermined-io/development'
const seedWords = process.env.SEED_WORDS

Logger.setLevel(3)

export const appConfig: NeverminedOptions = {
  web3Provider:
    typeof window !== 'undefined'
      ? (window as any).ethereum
      : new ethers.providers.JsonRpcProvider(web3ProviderUri),
  accounts: seedWords ? makeAccounts(seedWords) : undefined,
  web3ProviderUri,
  neverminedNodeUri,
  graphHttpUri,
  verbose: true,
  neverminedNodeAddress,
  marketplaceAuthToken: AuthToken.fetchMarketplaceApiTokenFromLocalStorage().token,
  marketplaceUri,
  artifactsFolder: path.join(__dirname, '../artifacts'),
}
