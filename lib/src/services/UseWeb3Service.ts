import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { UseAccountsChangedListenerInput, Web3Service } from '../types';

const useWeb3Service = (web3: Web3): Web3Service => {
  const [loginError, setloginError] = useState<any>(undefined);
  const isAvailable = (): boolean => web3 !== null;

  const getAccounts = async (): Promise<string[]> => {
    if (!isAvailable() && !web3?.eth?.getAccounts) return [];
    const accounts = await web3?.eth?.getAccounts();
    return accounts;
  };

  const isLoggedIn = async (): Promise<boolean> => {
    if (!isAvailable() || !web3?.eth?.getAccounts) return false;
    const accounts = await web3?.eth?.getAccounts();
    return accounts && accounts?.length > 0;
  };

  const startLogin = async (): Promise<string[]> => {
    try {
      const response = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      return response;
    } catch (error) {
      setloginError(error);
      return [];
    }
  };

  return {
    isAvailable,
    loginError,
    startLogin,
    isLoggedIn,
    getAccounts
  };
};

export const useEthereumAccountChangedListener = (cb: UseAccountsChangedListenerInput) => {
  useEffect(() => {
    const registerOnAccounsChangedListener = async (): Promise<void> => {
      //@ts-ignore
      window.ethereum.on('accountsChanged', cb);
    };
    registerOnAccounsChangedListener();
  }, [cb]);
};

export default useWeb3Service;
