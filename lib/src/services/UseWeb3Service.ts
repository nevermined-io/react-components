import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { UseAccountsChangedListenerInput, Web3Service } from '../types';

export const service = {
  getAccounts: async (web3: Web3) => {
    if (!web3?.eth?.getAccounts) return [];
    const accounts = await web3?.eth?.getAccounts();
    return accounts;
  },
  isLoggedIn: async (web3: Web3): Promise<boolean> => {
    if (!web3?.eth?.getAccounts) return false;
    const accounts = await web3?.eth?.getAccounts();
    return accounts && accounts?.length > 0;
  },
  startLogin: async (): Promise<string[]> => {
    try {
      const response = await window?.ethereum.request({
        method: 'eth_requestAccounts'
      });
      return response;
    } catch (error) {
      return [];
    }
  }
};

const useWeb3Service = (web3: Web3): Web3Service => {
  const [loginError, setloginError] = useState<any>(undefined);

  const getAccounts = async (): Promise<string[]> => {
    return service.getAccounts(web3);
  };

  const isLoggedIn = async (): Promise<boolean> => {
    return service.isLoggedIn(web3);
  };

  const startLogin = async (): Promise<string[]> => {
    return service.startLogin();
  };

  return {
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
      window?.ethereum?.on('accountsChanged', cb);
    };
    registerOnAccounsChangedListener();
  }, [cb]);
};

export default useWeb3Service;
