import {
  Account,
  Config,
  DDO,
  MetaData,
  Nevermined,
  SearchQuery
} from '@nevermined-io/nevermined-sdk-js';
import {
  ContractEventSubscription,
  EventResult
} from '@nevermined-io/nevermined-sdk-js/dist/node/events';
import { TxParameters } from '@nevermined-io/nevermined-sdk-js/dist/node/keeper/contracts/ContractBase';
import { QueryResult } from '@nevermined-io/nevermined-sdk-js/dist/node/metadata/Metadata';
import AssetRewards from '@nevermined-io/nevermined-sdk-js/dist/node/models/AssetRewards';
import { Bytes } from '@ethersproject/bytes';
import {
  ProviderMessage,
  ProviderRpcError,
  ProviderConnectInfo,
  RequestArguments
} from 'hardhat/types';

export interface NeverminedProviderContext {
  sdk: Nevermined;
  sdkError: any;
  isLoadingSDK: boolean;
  updateSDK: (newConfig: Config) => Promise<boolean>;
  subscribe: SubscribeModule;
  assets: AssetsModule;
  account: AccountModule;
  events: EventsModule;
}

export interface NeverminedProviderProps {
  children: any;
  verbose?: boolean;
  config: Config;
}

export interface OutputUseNeverminedService {
  sdk: Nevermined;
  isLoading: boolean;
  error: any;
}

export interface GenericOutput<T, E> {
  data: T;
  error: E;
  success: boolean;
}

export type DID = string;

export interface NFTDetails {
  owner: any;
  lastChecksum: any;
  url: any;
  lastUpdatedBy: any;
  blockNumberUpdated: number;
  providers: any;
  nftSupply: number;
  mintCap: number;
  royalties: number;
}

export interface UserProfileParams {
  nickname: string;
  name?: string;
  email?: string;
  additionalInformation?: unknown;
}

export interface AccountModule {
  getReleases: (address: string) => Promise<DID[]>;
  getCollection: (address: string) => Promise<DID[]>;
  generateToken: () => Promise<MarketplaceAPIToken>;
  isTokenValid: () => boolean;
}

export interface EventsModule {
  fetchAccountTransferEvents: (address: string) => Promise<EventResult>;
}

export interface AssetsModule {
  getSingle: (did: DID) => Promise<DDO>;
  query: (q: SearchQuery) => Promise<QueryResult>;
  resolve: (did: DID) => Promise<DDO | undefined>;
  mint: (did: any) => Promise<any>;
  nftDetails: (did: string) => Promise<NFTDetails>;
}

export interface SubscribeModule {
  paymentEvents: (cb: (events: EventResult[]) => void) => ContractEventSubscription;
  transferEvents: (cb: (events: EventResult[]) => void) => ContractEventSubscription;
}

export interface AssetState {
  ddo: DDO;
  metadata: MetaData;
  error: string;
  isLoading: boolean;
  nftDetails: NFTDetails;
}

export interface MintNFTInput {
  metadata: MetaData;
  publisher: Account;
  cap: number;
  royalties: number;
  assetRewards: AssetRewards;
  nftAmount?: number;
  erc20TokenAddress?: string;
  preMint?: boolean;
  nftMetadata?: string;
  txParams?: TxParameters;
}

export interface MarketplaceAPIToken {
  token: string;
}

interface ChainNetwork {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
  iconUrls: string[];
}

export interface ChainConfig {
  development: ChainNetwork;
  mumbai: ChainNetwork;
  mainnet: ChainNetwork;
  returnConfig: (chainIdHex: string) => ChainNetwork;
}

export interface Methods<T> {
  balanceOf: (address: string, tokenId: number) => this;
  setApprovalForAll: (operator: string, approved: boolean) => this;
  safeTransferFrom: (from: string, to: string, id: number, amount: number, data: Bytes) => this;
  isApprovedForAll: (account: string, address: string) => this;
  hasRole: (role: string, address: string) => this;
  calcReward: (address: string) => this;
  faucetNFT: () => this;
  mintRZR: () => this;
  call: () => T;
  send: (from: string) => T;
}

export interface DispatchData<T> {
  type: string;
  payload: T;
  error: Error;
}

export interface EthereumEvent {
  connect: ProviderConnectInfo;
  disconnect: ProviderRpcError;
  accountsChanged: Array<string>;
  chainChanged: string;
  message: ProviderMessage;
}

type EventKeys = keyof EthereumEvent;
type EventHandler<K extends EventKeys> = (event: EthereumEvent[K]) => void;

export interface Ethereumish {
  autoRefreshOnNetworkChange: boolean;
  chainId: string;
  isMetaMask?: boolean;
  isStatus?: boolean;
  networkVersion: string;
  selectedAddress: any;

  on<K extends EventKeys>(event: K, eventHandler: EventHandler<K>): void;
  enable(): Promise<any>;
  request?: (request: { method: string; params?: Array<any> }) => Promise<any>;
  send?: (
    request: { method: string; params?: Array<any> },
    callback: (error: any, response: any) => void
  ) => void;
  sendAsync: (request: RequestArguments) => Promise<unknown>;
}
