import React, {
    useState,
    createContext,
    useEffect,
    useRef,
    useContext,
} from "react";
import { ethers } from "ethers";
import DefaultChainConfig from "./chain-config"

export type MetamaskProvider = ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider

const convertHextoIntString = (hex: string) => {
    const removedAddressFormat = hex.replace("0x", "");
    const intString = parseInt(removedAddressFormat, 16);

    return intString.toString();
};

/**
 * Config network to connect with dapp
 */
 interface ChainNetwork {
    /** Chain id of the network */
    chainId: string;
    /** Chain name of the network */
    chainName: string;
    /** Native currency of the network
     * @example
     * Ethereum blockchain -> Ethereum currency
     */
    nativeCurrency: {
      /** Name of the token */
      name: string;
      /** Nick of the token
       * @example
       * Ethereum -> ETH
       */
      symbol: string;
      /** Decimals of the token */
      decimals: number;
    };
    /** RPC url to request to the network blockchain */
    rpcUrls: string[];
    /** Url to explore the transactions from specific network */
    blockExplorerUrls: string[];
    /** The icon which represent the network */
    iconUrls: string[];
  }
  
  /**
   * Config with all the networks which can be connect by the dapp
   * 
   * @example
   * Config example:
   * ```ts
   * import { zeroX } from '@nevermined-io/catalog-providers';
   * import { acceptedChainId } from 'config';
   * 
   * const acceptedChainIdHex = zeroX((+acceptedChainId).toString(16));
   * const spreeChainId = zeroX((8996).toString(16));
   * const polygonLocalnetChainId = zeroX((8997).toString(16));
   * export const mumbaiChainId = zeroX((80001).toString(16));
   * const mainnetChainId = zeroX((137).toString(16));
   * 
   * const ChainConfig = {
   *   development: {
   *     chainId: acceptedChainIdHex === spreeChainId ? spreeChainId : polygonLocalnetChainId,
   *     chainName: 'Localhost development',
   *     nativeCurrency: {
   *       name: 'Ethereum',
   *       symbol: 'ETH',
   *       decimals: 18
   *     },
   *     rpcUrls: ['http://localhost:8545'],
   *     blockExplorerUrls: [''],
   *     iconUrls: ['https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png']
   *   },
   *   mumbai: {
   *     chainId: mumbaiChainId,
   *     chainName: 'Polygon Testnet Mumbai',
   *     nativeCurrency: {
   *       name: 'Matic',
   *       symbol: 'MATIC',
   *       decimals: 18
   *     },
   *     rpcUrls: [
   *       'https://matic-mumbai.chainstacklabs.com',
   *       'https://rpc-endpoints.superfluid.dev/mumbai'
   *     ],
   *     blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
   *     iconUrls: ['https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png']
   *   },
   *   mainnet: {
   *     chainId: mainnetChainId,
   *     chainName: 'Polygon Mainnet',
   *     nativeCurrency: {
   *       name: 'Matic',
   *       symbol: 'MATIC',
   *       decimals: 18
   *     },
   *     rpcUrls: ['https://polygon-rpc.com'],
   *     blockExplorerUrls: ['https://polygonscan.com/'],
   *     iconUrls: ['https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png']
   *   },
   *   returnConfig: (chainIdHex: string) => {
   *     if (chainIdHex === spreeChainId || chainIdHex === polygonLocalnetChainId) {
   *       return ChainConfig.development;
   *     }
   *     if (chainIdHex === mumbaiChainId) {
   *       return ChainConfig.mumbai;
   *     }
   *     if (chainIdHex === mainnetChainId) {
   *       return ChainConfig.mainnet;
   *     }
   *     return ChainConfig.development;
   *   }
   * };
   * ```
   */
  export interface ChainConfig {
    /** Networks settings */
    [network: string]: ChainNetwork | ((chainIdHex: string) => ChainNetwork);
    /** Return the network confing by giving chain Id in Hexadecimal */
    returnConfig: (chainIdHex: string) => ChainNetwork;
  }
  
/**
 * Provider with all the functionalities to manage Metamask wallet
 */
export interface WalletProviderState {
    /** Metamask provider for example web3 or ethers */
    getProvider: () => MetamaskProvider;
    /** Logout from the wallet */
    logout: () => void;
    /** Check if the user is logged in the Metamask wallet */
    checkIsLogged: () => Promise<boolean>;
    /** If Metamask wallet is installed and available in the browser */
    isAvailable: () => boolean;
    /** Check if the switched chain is supported
     * and in case that not it suggests to change to the default chain
     * also if a chain is not registered in Metamask it ask for register it */
    switchChainsOrRegisterSupportedChain: () => Promise<void>;
    /** The address of the wallet account */
    walletAddress: string;
    /** Login in Metamask */
    loginMetamask: () => Promise<void>;
    /** If chain is supported between available networks */
    isChainCorrect: boolean;
}

export const WalletContext = createContext({} as WalletProviderState);

/**
 * Wallet provider for Metamask with all the functionalities to handle the wallet in dapp 
 * @param config
 * @param config.nodeUri Blockchain node url to connect
 * @param config.correctNetworkId Id of the default blockchain network in Hexadecimal
 * @param config.externalChainConfig Config with all the available chains that can be use in the dapp
 * @returns All the functionalities to handle the wallet in dapp
 * 
 * @example
 * Start Metamask provider example:
 * 
 * ```tsx
 * import React from 'react';
 * import ReactDOM from 'react-dom';
 * import Catalog from '@nevermined-io/catalog-core';
 * import { appConfig } from './config';
 * import Example from 'examples';
 * import { MetaMask } from '@nevermined-io/catalog-providers';
 * import chainConfig, { mumbaiChainId } from './chain_config';
 * 
 * 
 * ReactDOM.render(
 *   <div>
 *     <Catalog.NeverminedProvider config={appConfig} verbose={true}>
 *       <MetaMask.WalletProvider
 *         externalChainConfig={chainConfig}
 *         correctNetworkId={mumbaiChainId}
 *         nodeUri={String(appConfig.nodeUri)}
 *       >
 *         <Example />
 *       </MetaMask.WalletProvider>
 *     </Catalog.NeverminedProvider>
 *   </div>,
 *   document.getElementById('root') as HTMLElement
 * );
 * ```
 */
export const WalletProvider = ({
    children,
    nodeUri,
    correctNetworkId,
    externalChainConfig,
}: {
    children: React.ReactElement;
    nodeUri: string;
    correctNetworkId: string;
    externalChainConfig?: ChainConfig;
}) => {
    const correctChainId = convertHextoIntString(correctNetworkId);
    const eths = useRef({} as MetamaskProvider);
    const [walletAddress, setWalletAddress] = useState<string>("");
    const [acceptedChainId, setAcceptedChainId] = useState("");
    const [acceptedChainIdHex, setAcceptedChainIdHex] = useState("");
    const [isChainCorrect, setIsChainCorrect] = useState(true);
    const chainConfig: ChainConfig = externalChainConfig || DefaultChainConfig;

    const checkIsNotChainCorrect = (chainHexId: string) => {
        return !Object.keys(chainConfig).some((env: string) => {
            if (env === "returnConfig") {
                return false;
            }

            return (chainConfig[env] as ChainNetwork).chainId === chainHexId;
        });
    };

    const checkChain = async (chainHexId: string) => {
        if (checkIsNotChainCorrect(chainHexId)) {
            setAcceptedChainId(correctChainId);
            setAcceptedChainIdHex(correctNetworkId);
            setIsChainCorrect(false);
        } else {
            setAcceptedChainId(convertHextoIntString(chainHexId));
            setAcceptedChainIdHex(chainHexId);
        }
    };

    useEffect(() => {
        if (!isChainCorrect) switchChainsOrRegisterSupportedChain();
    }, [isChainCorrect]);

    useEffect(() => {
        (async () => {
            try {
                const chainIdHex = await window.ethereum.request?.({
                    method: "eth_chainId",
                });
                const chainId = convertHextoIntString(chainIdHex);
                setAcceptedChainId(chainId);
                checkChain(chainIdHex);
            } catch (error: any) {
                console.error(error.message)
            }
        })();

        window.ethereum.on("chainChanged", (chainHexId: string) => {
            checkChain(chainHexId);
        });
    }, []);

    useEffect(() => {
        const registerOnAccounsChangedListener = async (): Promise<void> => {
            window.ethereum.on("accountsChanged", (newAccount: string[]) => {
                if (newAccount && newAccount.length > 0) {
                    setWalletAddress(
                        ethers.utils.getAddress(newAccount[0])
                    );
                } else {
                    setWalletAddress("");
                    console.log("No Account found!");
                }
            });
        };

        registerOnAccounsChangedListener();
    }, []);

    const updateWalletAddress = async (): Promise<void> => {
        const accounts = await eths.current?.listAccounts();
        setWalletAddress(
            accounts?.length ? ethers.utils.getAddress(accounts[0]) : ""
        );
    };

    useEffect(() => {
        (() => {
            let provider = {} as MetamaskProvider
            // Modern dapp browsers
            if (window.ethereum) {
                provider = new ethers.providers.Web3Provider(window.ethereum);
            }
            // Legacy dapp browsers
            else if (window.web3) {
                provider = new ethers.providers.Web3Provider(window.web3);
            } else {
                console.log("No Web3, defaulting to HTTPProvider");
                provider = new ethers.providers.JsonRpcProvider(nodeUri);
            }
            eths.current = provider;
        })();
    }, []);

    useEffect(() => {
        if(!eths.current?.listAccounts) return
        
        updateWalletAddress();
    }, [eths.current?.listAccounts])

    const switchChainsOrRegisterSupportedChain = async (): Promise<void> => {
        if (!acceptedChainIdHex) {
            return;
        }
        try {
            await window.ethereum.request?.({
                method: "wallet_switchEthereumChain",
                params: [
                    {
                        chainId: acceptedChainIdHex,
                    },
                ],
            });

            setIsChainCorrect(true);
        } catch (switchError) {
            if ((switchError as any).code === 4902) {
                try {
                    const currentChainConfig =
                        chainConfig.returnConfig(acceptedChainIdHex);
                    const configParam = await window.ethereum.request?.({
                        method: "wallet_addEthereumChain",
                        params: [currentChainConfig],
                    });
                    if (!configParam) {
                        console.log(
                            `Chain ${acceptedChainId} added successfully!`
                        );
                    }
                } catch (addError) {
                    console.error(addError);
                }
            }
            console.error(switchError);
        }
    };

    const isAvailable = (): boolean => {
        return eths.current !== null;
    };

    const checkIsLogged = async (): Promise<boolean> => {
        if (!isAvailable() || !eths.current?.listAccounts) return false;
        const accounts = await eths.current?.listAccounts();
        return Boolean(accounts?.length);
    };

    const startLogin = async (): Promise<string[]> => {
        try {
            const response = await window.ethereum.request?.({
                method: "eth_requestAccounts",
            });
            setWalletAddress(ethers.utils.getAddress(response[0]));
            return response;
        } catch (error) {
            return await Promise.reject(error);
        }
    };

    const loginMetamask = async () => {
        try {
            await startLogin();
        } catch (error) {
            console.error(error);
        }
    };

    const logout = (): void => {
        setWalletAddress("");
    };

    const getProvider = (): MetamaskProvider => {
        return eths.current;
    };

    const IState = {
        walletAddress,
        loginMetamask,
        getProvider,
        logout,
        switchChainsOrRegisterSupportedChain,
        checkIsLogged,
        isAvailable,
        isChainCorrect,
    };

    return (
        <WalletContext.Provider value={IState}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = (): WalletProviderState => useContext(WalletContext);
