import { Config, DDO, DID, MetaData, Nevermined } from "@nevermined-io/nevermined-sdk-js";
import Web3 from "web3";
import { TokenUtilsService } from "./hooks/UseTokenUtilsManager";

export interface Web3Manager {
  startLogin: () => Promise<string[]>;
  isLoggedIn: () => Promise<boolean>;
  isAvailable: () => boolean;
}

export interface NeverminedProviderContext {
  sdk: Nevermined;
  web3Provider: Web3;
  web3Manager: Web3Manager;
  tokenUtils: TokenUtilsService;
}

export interface NeverminedProviderProps {
  children: React.ReactNode;
  config: Config;
}

export type UseAccountsChangedListenerInput = (accounts: string[]) => void;

export interface UseIsAccountLoggedInInput {
  isLoggedIn: boolean;
  setIsLoggedIn: (i: boolean) => void;
}

export interface UseAllAssetsResult {
  assets: DDO[];
  isLoading: boolean;
}


export enum AssetType {
  dataset,
  algorithm,
  compute,
  workflow
}
/**
 * One-dimensional mapping of Nevermined MetaData to be used with the form.
 */
export interface MetaDataFormDTO {
  name?: string;
  type?: AssetType;
  dateCreated?: string;
  datePublished?: string;
  author?: string;
  license?: string;
  price?: string;
  files?: File[];
  encryptedService?: any;
  workflow?: any;
  algorithm?: any;
  service?: any;
  description?: string;
  copyrightHolder?: string;
}

export interface MetaDataFormProviderValue {}

/**
 * Props for the FormProvider.
 * You can set default values that match the @MetaDataFormDTO
 */
export interface MetaDataFormProviderProps {
  children?: React.ReactNode;
  defaultValues?: MetaDataFormDTO;
}

export interface UseAssetManager {
  registerAsset: (data: MetaData) => Promise<DDO | any>;
  registerMintableAsset: (data: MetaData) => Promise<DDO>;
  retrieveAssetDDO: (did: DID | string) => Promise<DDO>;
}
