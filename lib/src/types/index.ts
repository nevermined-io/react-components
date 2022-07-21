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

export enum State {
  Disabled = 'disabled',
  Unconfirmed = 'unconfirmed',
  Confirmed = 'confirmed'
}

export interface UserProfileParams {
  userId: string;
  isListed: boolean;
  state: State;
  nickname: string;
  name: string;
  email: string;
  creationDate: string;
  updateDate: string;
  additionalInformation: unknown;
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
  downloadNFT: (did: string) => Promise<boolean>;
  downloadAsset: (did: string) => Promise<boolean>;
  consumeAsset: (did: string, agreementId: string) => Promise<boolean>;
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
  [network: string]: ChainNetwork | ((chainIdHex: string) => ChainNetwork);
  returnConfig: (chainIdHex: string) => ChainNetwork;
}

export interface AssetFile {
  [key: string]: any;
  type: string;
  label: string;
}

export interface AssetPublishParams {
  [key: string]: any;
  name: string;
  author: string;
  description: string;
  type: string;
  category: string;
  price: number;
  assetFiles: AssetFile[];
}

export interface FileMetadata {
  index: number;
  contentType: string;
  url: string;
  contentLength: string;
}
