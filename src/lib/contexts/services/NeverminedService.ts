import React, { useState, useCallback, useEffect } from 'react';
import { Nevermined, Config, Account } from '@nevermined-io/nevermined-sdk-js';

import { Web3ServiceContext } from './Web3Service'

export function useNeverminedService(config: Config, { web3, address, network: { chainId } }: Web3ServiceContext) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sdk, setSdk] = useState({} as Nevermined);
  const [account, setAccount] = useState<Account>(new Account(''));
  const [balance, setBalance] = useState<{ eth?: number, nevermined?: number }>({});
  const [networkName, setNetworkName] = useState('');

  // Update balance function
  const updateBalance = useCallback(
    async (balanceAccount: Account) => {
      const balanceFetched = await balanceAccount.getBalance();
      const { eth, nevermined } = balance;
      if (eth !== balanceFetched.eth || nevermined !== balanceFetched.nevermined) {
        setBalance(balanceFetched);
      }
    },
    [balance]
  );

  // Fetch account using current address
  useEffect(() => {
    if (!address || !sdk?.accounts) {
      return
    }
    sdk.accounts?.list()
      .then(([sdkAccount]) => {
        if (account) {
          const accountFetched = sdkAccount.getId();

          if (account && accountFetched.toLowerCase() !== account.getId().toLowerCase()) {
            setAccount(sdkAccount);
          }
          return updateBalance(sdkAccount);
        }
      })
  }, [address, sdk]);

  // Fetch network name
  useEffect(() => {
    if (!chainId || !sdk?.keeper) {
      return
    }
    sdk.keeper.getNetworkName()
      .then(setNetworkName)
  }, [address, sdk]);

  // Load Nevermined SDK
  const loadNevermined = useCallback(async (): Promise<void> => {
    if (web3) {
      const nvmSdk: any = await Nevermined.getInstance(config);
      setSdk(nvmSdk);
      setIsLoading(false);
    }
  }, [web3]);

  useEffect(() => {
    loadNevermined();
  }, [web3, loadNevermined]);

  return {
    isLoading,
    sdk,
    user: {
      balance,
      account,
      address,
      updateBalance,
    },
    network: {
      chainId,
      networkName,
    },
  }
}

export type NeverminedServiceContext = ReturnType<typeof useNeverminedService>
