import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';
import Web3 from 'web3';
import { Config, Account } from '@nevermined-io/nevermined-sdk-js';

import BurnerWalletProvider from 'lib/contexts/wallets/BurnerWalletProvider';
import BrowserProvider from 'lib/contexts/wallets/BrowserProvider';

export function useWeb3Service(config: Config) {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [web3, setWeb3] = useState<Web3>();
  const [address, setAddress] = useState<string | undefined>('');

  // TODO: BurnerWallet needs to be integrated
  // TODO: It's necessary to watch the account change
  // TODO: It's necessary to watch the network change

  const connect = async () => {
    let browserProvider;
    if (false) {
      console.warn('Using Burner Wallet. Only for testing purposes.');
      browserProvider = new BurnerWalletProvider(config.nodeUri!);
    } else {
      browserProvider = BrowserProvider;
    }
    await browserProvider.startLogin();
    const accounts: string[] = await (browserProvider as any).web3?.eth.getAccounts();
    setIsConnected(true);
    setWeb3((browserProvider as any).web3);
    setAddress(accounts[0]);
  };

  const disconnect = () => {
    setIsConnected(false);
    const browserProvider = BrowserProvider;
    browserProvider.logout();
  };

  const initialize = async () => {
    await connect();
  };

  useEffect(() => {
    initialize();
  }, []);

  return {
    web3,
    address,
    isConnected,
    connect,
    disconnect,
  }
}

export type Web3ServiceContext = ReturnType<typeof useWeb3Service>
