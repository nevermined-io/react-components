import React from "react";
import Web3 from "web3";
export interface ChainNetwork {
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
export interface WalletProviderState {
    getProvider: () => Web3;
    logout: () => void;
    checkIsLogged: () => Promise<boolean>;
    isAvailable: () => boolean;
    promptSwitchAccounts: () => Promise<void>;
    switchChainsOrRegisterSupportedChain: () => Promise<void>;
    walletAddress: string;
    loginMetamask: () => Promise<void>;
    isChainCorrect: boolean;
}
export declare const WalletContext: React.Context<WalletProviderState>;
export declare const WalletProvider: ({ children, nodeUri, correctNetworkId, chainConfig, }: {
    children: React.ReactElement;
    nodeUri: string;
    correctNetworkId: string;
    chainConfig: ChainConfig;
}) => JSX.Element;
export declare const useWallet: () => WalletProviderState;
