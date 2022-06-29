import { useState, createContext, useEffect, useRef } from 'react';
import { Logger, Nevermined, Account } from '@nevermined-io/nevermined-sdk-js';
import { zeroX } from '@nevermined-io/nevermined-sdk-js/dist/node/utils';
import Web3 from 'web3';

interface WalletProviderState {
    getProvider: () => Web3;
    logout: () => void;
    isLogged: () => Promise<boolean>;
    isAvailable: () => boolean;
    promptSwitchAccounts: () => Promise<void>;
    walletAddress: string;
    loginMetamask: () => Promise<void>;
}

export const WalletContext = createContext({} as WalletProviderState);

export const WalletProvider = ({ children }: { children: React.ReactElement }) => {
    const w3 = useRef({} as Web3);
    const [walletAddress, setWalletAddress] = useState<string>('');
    const acceptedChainIdHex = zeroX((+acceptedChainId).toString(16));

    useEffect(() => {
        const registerOnAccounsChangedListener = async (): Promise<void> => {
            window.ethereum.on('accountsChanged', (newAccount: string[]) => {
                if (newAccount && newAccount.length > 0) {
                    setWalletAddress(Web3.utils.toChecksumAddress(newAccount[0]));
                } else {
                    setWalletAddress('');
                    console.log('No Account found!');
                }
            });
        };

        registerOnAccounsChangedListener();
    }, []);

    const updateWalletAddress = async (): Promise<void> => {
        const accounts = await w3.current?.eth?.getAccounts();
        setWalletAddress(accounts?.length ? Web3.utils.toChecksumAddress(accounts[0]) : '');
    };

    useEffect(() => {
        const switchChainsOrRegisterSupportedChain = async (): Promise<void> => {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [
                        {
                            chainId: acceptedChainIdHex,
                        },
                    ],
                });
            } catch (switchError) {
                if ((switchError as any).code === 4902) {
                    try {
                        const currentChainConfig = ChainConfig.returnConfig(acceptedChainIdHex);
                        const configParam = await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [currentChainConfig],
                        });
                        if (!configParam) {
                            console.log(`Chain ${acceptedChainId} added successfully!`);
                        }
                    } catch (addError) {
                        Logger.error(addError);
                    }
                }
                Logger.error(switchError);
            }
        };
        switchChainsOrRegisterSupportedChain();
    }, []);

    useEffect(() => {
        const getWeb3 = () => {
            let web3 = {} as Web3;
            // Modern dapp browsers
            if (window.ethereum) {
                web3 = new Web3(window.ethereum);
            }
            // Legacy dapp browsers
            else if (window.web3) {
                web3 = new Web3(window.web3.currentProvider);
            } else {
                console.log('No Web3, defaulting to HTTPProvider');
                web3 = new Web3(new Web3.providers.HttpProvider(nodeUri));
            }
            w3.current = web3;
            updateWalletAddress();
        };
        getWeb3();
    }, []);

    const isAvailable = (): boolean => {
        return w3.current !== null;
    };

    const promptSwitchAccounts = async () => {
        await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [
                {
                    eth_accounts: {},
                },
            ],
        });
    };

    const isLogged = async (): Promise<boolean> => {
        if (!isAvailable() && !w3.current?.eth?.getAccounts) return false;
        const accounts = await w3.current?.eth?.getAccounts();
        return accounts && accounts?.length > 0;
    };

    const startLogin = async (): Promise<string[]> => {
        try {
            const response = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });
            if (response) {
                localStorage.setItem('logType', 'Metamask');
            }
            setWalletAddress(Web3.utils.toChecksumAddress(response[0]));
            return response;
        } catch (error) {
            return await Promise.reject(error);
        }
    };

    const loginMetamask = async () => {
        try {
            await startLogin();
        } catch (error) {
            Logger.error(error);
        }
    };

    const logout = (): void => {
        localStorage.removeItem('logType');
        setWalletAddress('');
    };

    const getProvider = (): Web3 => {
        return w3.current;
    };

    const IState = {
        walletAddress,
        loginMetamask,
        getProvider,
        logout,
        promptSwitchAccounts,
        isLogged,
        isAvailable,
    };

    return <WalletContext.Provider value={IState}>{children}</WalletContext.Provider>;

};

