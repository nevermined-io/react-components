import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';

import Web3 from 'web3';
import { Config, Nevermined, Account, MetaData } from '@nevermined-io/nevermined-sdk-js';
import MetaMaskProvider from './wallets/MetaMaskProvider';

import generalConfig from '../config';
import BurnerWalletProvider from './wallets/BurnerWalletProvider';
const config = generalConfig.neverminedConfig;
const isBurnerWalletEnabled = generalConfig.isBurnerWalletEnabled;

interface NeverminedProviderValue {
  isLoggedIn: boolean;
  isLoading: boolean;
  account: Account;
  balance: {
    eth: number;
    nevermined: number;
  };
  // network: string
  web3: Web3;
  sdk: Nevermined;
  // requestFromFaucet?(account: string): Promise<FaucetResponse>
  loginMetamask(): Promise<any>;
  logoutMetamask(): void;
  // message: string;
  // tokenSymbol: string;
}

const createWeb3Instance = () => {
  if (window.ethereum) {
    return new Web3(window.ethereum);
  } else if (window.web3) {
    return new Web3(window.web3.currentProvider);
  } else {
    return null;
  }
};

const NeverminedProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [balance, setBalance] = useState({
    eth: 0,
    nevermined: 0
  });

  const [web3, setWeb3] = useState<Web3>();
  const [account, setAccount] = useState<Account>(new Account(''));
  const [sdk, setSdk] = useState({} as Nevermined);

  const fetchBalance = useCallback(
    async (balanceAccount: Account) => {
      const balanceFetched = await balanceAccount.getBalance();
      const { eth, nevermined } = balance;
      if (eth !== balanceFetched.eth || nevermined !== balanceFetched.nevermined) {
        setBalance(balanceFetched);
      }
    },
    [balance]
  );

  const fetchAccounts = useCallback(async () => {
    if (sdk.accounts) {
      let accounts;

      // Modern dapp browsers
      if (window.ethereum && !isLoggedIn) {
        // simply set to empty, and have user click a button somewhere
        // to initiate account unlocking
        accounts = [];

        // alternatively, automatically prompt for account unlocking
      }

      if (sdk && sdk.accounts) {
        accounts = await sdk.accounts?.list();

        if (accounts.length > 0) {
          const accountFetched = accounts[0].getId();

          if (account && accountFetched !== account?.getId()) {
            setAccount(accounts[0]);
            setIsLoggedIn(true);
          }
          await fetchBalance(accounts[0]);
        } else if (!isLoggedIn) {
          console.log('No account logged');
        }
      }
    }
  }, [account, isLoggedIn, sdk, fetchBalance]);

  const loadNevermined = useCallback(async (): Promise<void> => {
    if (web3) {
      const nvmSdk: any = await Nevermined.getInstance(config);
      setSdk(nvmSdk);
      setIsLoading(false);
    }
  }, [web3]);

  // * LIFECYCLE
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  useEffect(() => {
    console.log('should load nevermined');
    loadNevermined();
  }, [web3, loadNevermined]);

  const loginMetamask = async () => {
    let metamaskProvider;
    if (isBurnerWalletEnabled === 'true') {
      // changed to false from true
      console.log(isBurnerWalletEnabled);
      metamaskProvider = new BurnerWalletProvider();
    } else {
      metamaskProvider = MetaMaskProvider;
    }
    await metamaskProvider.startLogin();
    const accounts: string[] = await (metamaskProvider as any).web3?.eth.getAccounts();
    setIsLoggedIn(true);
    setWeb3((metamaskProvider as any).web3);
    setAccount(new Account(accounts[0]));
  };

  const logoutMetamask = () => {
    const metamaskProvider = MetaMaskProvider;
    setIsLoggedIn(false);
    metamaskProvider.logout();
  };

  const initialize = async (): Promise<void> => {
    await loginMetamask();
  };

  useEffect(() => {
    initialize();
    /* eslint-disable-next-line */
  }, []);
  return (
    <NeverminedContext.Provider
      value={
        {
          isLoggedIn,
          isLoading,
          account,
          balance,
          web3,
          sdk,
          loginMetamask,
          logoutMetamask
          // network,
          // requestFromFaucet,
          // message,
          // tokenSymbol
        } as NeverminedProviderValue
      }
    >
      {children}
    </NeverminedContext.Provider>
  );
};

const NeverminedContext = createContext({} as NeverminedProviderValue);
// Helper hook to access the provider values
const useNevermined = (): NeverminedProviderValue => useContext(NeverminedContext);

export { useNevermined, NeverminedContext };
export default NeverminedProvider;
