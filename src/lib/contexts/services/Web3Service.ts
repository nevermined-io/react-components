import React, { useState, useCallback, useEffect } from 'react';
import Web3 from 'web3';
import { Config } from '@nevermined-io/nevermined-sdk-js';

import BurnerWalletProvider from 'lib/contexts/wallets/BurnerWalletProvider';
import BrowserProvider from 'lib/contexts/wallets/BrowserProvider';

export function useWeb3Service(config: Config, shouldReloadOnNetworkChange?: boolean) {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [web3, setWeb3] = useState<Web3>();
  const [address, setAddress] = useState<string | undefined>('');
  const [chainId, setChainId] = useState<string | undefined>('');

  // TODO: BurnerWallet needs to be integrated

  const connect = useCallback(async () => {
    let browserProvider: typeof BrowserProvider | BurnerWalletProvider;
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
    return browserProvider
  }, []);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    const browserProvider = BrowserProvider;
    browserProvider.logout();
  }, []);

  const initialize = async () => {
    const wallet = await connect();
    wallet.onAccountChange(address => setAddress(address));
    wallet.onNetworkChange(chainId => {
      setChainId(chainId)
      if (shouldReloadOnNetworkChange) {
        window.location?.reload();
      }
    });
    setChainId(await wallet.getProvider().eth.getChainId())
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
    network: {
      chainId,
    },
  }
}

export type Web3ServiceContext = ReturnType<typeof useWeb3Service>
