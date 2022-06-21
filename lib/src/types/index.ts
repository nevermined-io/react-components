import { Config, DDO, MetaData, Nevermined, SearchQuery } from '@nevermined-io/nevermined-sdk-js';
import {
    ContractEventSubscription,
    EventResult
} from '@nevermined-io/nevermined-sdk-js/dist/node/events';
import { QueryResult } from '@nevermined-io/nevermined-sdk-js/dist/node/metadata/Metadata';

export interface NeverminedProviderContext {
  sdk: Nevermined;
  isLoadingSDK: boolean;
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

export interface AccountModule {
  getReleases: (address: string) => Promise<DID[]>;
  getCollection: (address: string) => Promise<DID[]>;
}

export interface EventsModule {
  fetchAccountTransferEvents: (address: string) => Promise<EventResult>;
}

export interface AssetsModule {
  getSingle: (did: DID) => Promise<DDO>;
  query: (q: SearchQuery) => Promise<QueryResult>;
  resolve: (did: DID) => Promise<DDO | undefined>;
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

