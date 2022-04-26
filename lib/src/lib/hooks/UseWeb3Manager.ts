import { UseAccountsChangedListenerInput, Web3Manager } from '../types';
import { useEffect } from 'react';
import Web3 from 'web3';

export const useWeb3Manager = (web3: Web3): Web3Manager => {
  const isAvailable = (): boolean => web3 !== null;

  const isLoggedIn = async (): Promise<boolean> => {
    if (!isAvailable() && !web3?.eth?.getAccounts) return false;
    const accounts = await web3?.eth?.getAccounts();
    return accounts && accounts?.length > 0;
  };

  const startLogin = async (): Promise<string[]> => {
    try {
      const response = await window.ethereum.request<string[]>({
        method: 'eth_requestAccounts'
      });
      if (!response?.length || !response[0]) {
        return [];
      }
      //@ts-ignore
      return response;
    } catch (error) {
      return await Promise.reject(error);
    }
  };

  const IState = {
    startLogin,
    isLoggedIn,
    isAvailable
  };

  return { ...IState };
};

export const useAccountsChangedListener = (cb: UseAccountsChangedListenerInput) => {
  useEffect(() => {
    const registerOnAccounsChangedListener = async (): Promise<void> => {
      //@ts-ignore
      window.ethereum.on('accountsChanged', cb);
    };
    registerOnAccounsChangedListener();
  }, []);
};

//const useSwitchChainsListener = () => {
//
//useEffect(() => {
//const switchChainsOrRegisterSupportedChain = async (): Promise<void> => {
//try {
//await window.ethereum.request({
//method: 'wallet_switchEthereumChain',
//params: [
//{
//chainId: acceptedChainIdHex
//}
//]
//});
//} catch (switchError) {
//if ((switchError as any).code === 4902) {
//try {
//const currentChainConfig = ChainConfig.returnConfig(acceptedChainIdHex);
//const configParam = await window.ethereum.request({
//method: 'wallet_addEthereumChain',
//params: [currentChainConfig]
//});
//if (!configParam) {
//console.log(`Chain ${acceptedChainId} added successfully!`);
//}
//} catch (addError) {
//Logger.error(addError);
//}
//}
//Logger.error(switchError);
//}
//};
//switchChainsOrRegisterSupportedChain();
//}, []);
//};

// Web3.utils.toChecksumAddress(accounts[0])
//const acceptedChainIdHex = zeroX((+acceptedChainId).toString(16));
