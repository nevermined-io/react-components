import { NeverminedOptions, Logger } from '@nevermined-io/sdk'
import path from 'path'
import { ethers } from 'ethers'

const neverminedNodeAddress =
  process.env.NEVERMINED_NODE_ADDRESS || '0x068ed00cf0441e4829d9784fcbe7b9e26d4bd8d0'
const neverminedNodeUri = process.env.NEVERMINED_NODE_URI || 'http://node.nevermined.localnet'
const marketplaceUri = process.env.MARKETPLACE_URI || 'http://marketplace.nevermined.localnet'
const web3ProviderUri = process.env.WEB3_PROVIDER_URI || `http://contracts.nevermined.localnet`

Logger.setLevel(3)

export const appConfig: NeverminedOptions = {
  web3Provider:
    typeof window !== 'undefined'
      ? (window as any).ethereum
      : new ethers.providers.JsonRpcProvider(web3ProviderUri),
  web3ProviderUri,
  neverminedNodeUri,
  verbose: true,
  neverminedNodeAddress,
  marketplaceUri,
  artifactsFolder: path.join(__dirname, '../artifacts'),
}
