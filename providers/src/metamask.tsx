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
    getProvider: () => MetamaskProvider;
    logout: () => void;
    checkIsLogged: () => Promise<boolean>;
    isAvailable: () => boolean;
    promptSwitchAccounts: () => Promise<void>;
    switchChainsOrRegisterSupportedChain: () => Promise<void>;
    walletAddress: string;
    loginMetamask: () => Promise<void>;
    isChainCorrect: boolean;
}

export const WalletContext = createContext({} as WalletProviderState);

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

    const promptSwitchAccounts = async () => {
        await window.ethereum.request?.({
            method: "wallet_requestPermissions",
            params: [
                {
                    eth_accounts: {},
                },
            ],
        });
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
        promptSwitchAccounts,
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
