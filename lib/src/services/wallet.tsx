import React, { useState, createContext, useEffect, useRef, useContext } from 'react';
import { Logger, Config } from '@nevermined-io/nevermined-sdk-js';
import { noZeroX, zeroX } from '@nevermined-io/nevermined-sdk-js/dist/node/utils';
import { ChainConfig } from '../types';
import Web3 from 'web3';

export interface WalletProviderState {
    getProvider: () => Web3;
    logout: () => void;
    checkIsLogged: () => Promise<boolean>;
    isAvailable: () => boolean;
    promptSwitchAccounts: () => Promise<void>;
    switchChainsOrRegisterSupportedChain: () => Promise<void>
    walletAddress: string;
    loginMetamask: () => Promise<void>;
}

export const WalletContext = createContext({} as WalletProviderState);

export const WalletProvider = ({ children, nodeUri, chainConfig }: { children: React.ReactElement, nodeUri: string, chainConfig: ChainConfig }) => {
    const w3 = useRef({} as Web3);
    const [walletAddress, setWalletAddress] = useState<string>('');
    const [acceptedChainId, setAcceptedChainId] = useState('')
    const [acceptedChainIdHex, setAcceptedChainIdHex] = useState('');

    useEffect(() => {
        if(acceptedChainId && acceptedChainIdHex) {
            (async() => {
                switchChainsOrRegisterSupportedChain()      
            })()
        }
    }, [acceptedChainId, acceptedChainIdHex]);

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
                web3 = new Web3(new Web3.providers.HttpProvider(String(nodeUri)));
            }
            w3.current = web3;
            updateWalletAddress();
        };
        getWeb3();
    }, []);

    const switchChainsOrRegisterSupportedChain = async (): Promise<void> => {
        try {

            await window.ethereum.request?.({
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
                    const currentChainConfig = chainConfig.returnConfig(acceptedChainIdHex);
                    const configParam = await window.ethereum.request?.({
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

    const isAvailable = (): boolean => {
        return w3.current !== null;
    };

    const promptSwitchAccounts = async () => {
        await window.ethereum.request?.({
            method: 'wallet_requestPermissions',
            params: [
                {
                    eth_accounts: {},
                },
            ],
        });
    };

    const checkIsLogged = async (): Promise<boolean> => {
        if (!isAvailable() && !w3.current?.eth?.getAccounts) return false;
        const accounts = await w3.current?.eth?.getAccounts();
        return accounts && accounts?.length > 0;
    
    };

    const startLogin = async (): Promise<string[]> => {
        try {
            const chainId = await window.ethereum.request?.({ method: 'eth_chainId' });
            const chainIdHex = noZeroX((+chainId).toString(16))
            setAcceptedChainId(chainId)
            setAcceptedChainIdHex(chainIdHex)

            if(chainId !== await acceptedChainId) {
                
            }
            const response = await window.ethereum.request?.({
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
        switchChainsOrRegisterSupportedChain,
        checkIsLogged,
        isAvailable,
    };

    return (<WalletContext.Provider value={IState}>{children}</WalletContext.Provider>);
};

export const useWallet = (): WalletProviderState => useContext(WalletContext);

