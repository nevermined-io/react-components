import { Config, DDO, Nevermined } from "@nevermined-io/nevermined-sdk-js";
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
