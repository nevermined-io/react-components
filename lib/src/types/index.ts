import {
  Config,
  DDO,
  DID,
  MetaData,
  Nevermined,
  SearchQuery
} from '@nevermined-io/nevermined-sdk-js';

export interface NeverminedProviderContext {
  useSubscribeToPaymentEvents: any;
  useFetchAssetData: any;
  useAllAssets: any;
  useSubscribeToTransferEvents: any;
  sdk: Nevermined;
  useAccountCollection: any;
  useAccountReleases: any;
  usePaymentEvents: any;
  useUserTransferEvents: any;
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
