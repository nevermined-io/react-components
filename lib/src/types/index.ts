import { Config, DDO, MetaData, Nevermined, SearchQuery } from '@nevermined-io/nevermined-sdk-js';
import {
  ContractEventSubscription,
  EventResult
} from '@nevermined-io/nevermined-sdk-js/dist/node/events';
import { QueryResult } from '@nevermined-io/nevermined-sdk-js/dist/node/metadata/Metadata';

export interface NeverminedProviderContext {
  sdk: Nevermined;
  subscribe: SubscribeModule;
  assets: AssetsModule;
  account: AccountModule;
  events: EventsModule;
}

export interface NeverminedProviderProps {
  children: any;
  config: Config;
}

export type UseAccountsChangedListenerInput = (accounts: string[]) => void;

export enum AssetType {
  dataset,
  algorithm,
  compute,
  workflow
}

export interface UseAssetService {
  assets: DDO[];
  isLoadingFetchAssets: boolean;
  errorFetchAssets: boolean;
  useFetchAssets: (q: SearchQuery) => void;
  getAssetDDO: (did: DID | string) => Promise<DDO>;
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

export interface AssetState {
  ddo: DDO;
  metadata: MetaData;
  error: string;
  isLoading: boolean;
  nftDetails: any;
}

export type CollectionItem = {
  artwork: DDO;
  cover: string;
  price: number;
};

export interface NeverminedState {
  currentCase: string;
  sdk: Nevermined;
}

export interface AutonomiesMetaData {
  priceInEther?: number;
  artworkAuthor?: string;
  genre?: string;
  nftAmount: number | string;
  royalties: number;
  trackListing: string[];
  label?: string;
  royaltiesHolder?: string;
  collaborators?: string[];
  recipients: Recipients[];
  coverUrl: string;
  audioUrls: string[];
}

export type Recipients = {
  name: string;
  walletAddress: string;
  split?: number;
};

export const AutonomiesAttributeNames = [
  'royaltiesHolder',
  'royalties',
  'collaborators',
  'artworkAuthor',
  'genre',
  'label',
  'trackListing',
  'recipients',
  'coverUrl',
  'nftAmount',
  'audioUrls',
  'priceInEther'
];

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

export interface AccountModule {
  getReleases: (address: string) => Promise<DID[]>;
  getCollection: (address: string) => Promise<DID[]>;
}

export interface EventsModule {
  fetchAccountTransferEvents: (address: string) => Promise<EventResult>;
}

export interface AssetsModule {
  getSingle: (did: DID) => Promise<DDO>;
  getAll: () => Promise<QueryResult>;
  resolve: (did: DID) => Promise<DDO | undefined>;
}

export interface SubscribeModule {
  paymentEvents: (cb: (events: EventResult[]) => void) => ContractEventSubscription;
  transferEvents: (cb: (events: EventResult[]) => void) => ContractEventSubscription;
}
