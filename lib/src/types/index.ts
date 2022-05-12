import { Maybe } from '@metamask/providers/dist/utils';
import { Config, DDO, DID, Nevermined, SearchQuery } from '@nevermined-io/nevermined-sdk-js';

export interface Web3Service {
  startLogin: () => Promise<Maybe<string[]>>;
  isLoggedIn: () => Promise<boolean>;
  getAccounts: () => Promise<string[]>;
  loginError: any;
}

export interface NeverminedProviderContext {
  sdk: Nevermined;
}

export interface NeverminedProviderProps {
  children: React.ReactNode;
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
