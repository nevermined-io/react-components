import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';

import Web3 from 'web3';
import { Nevermined, Account, Config } from '@nevermined-io/nevermined-sdk-js';
import BrowserProvider from './wallets/BrowserProvider';

import BurnerWalletProvider from './wallets/BurnerWalletProvider';
import { FaucetResponse, requestFromFaucet } from '../utils/requestFromFaucet';

import { useWeb3Service, Web3ServiceContext } from 'lib/contexts/services/Web3Service'
import { useNeverminedService, NeverminedServiceContext } from 'lib/contexts/services/NeverminedService'


export type NeverminedProviderContext = Web3ServiceContext & NeverminedServiceContext

interface NeverminedProviderProps {
  children: React.ReactNode
  config: Config
  reloadOnNetworkChange?: boolean
}

const NeverminedProvider = ({ children, config, reloadOnNetworkChange }: NeverminedProviderProps): React.ReactElement => {
  const web3Context = useWeb3Service(config, reloadOnNetworkChange)
  const neverminedContext = useNeverminedService(config, web3Context)

  return (
    <NeverminedContext.Provider
      value={
        {
          ...web3Context,
          ...neverminedContext,
        } as NeverminedProviderContext
      }
    >
      {children}
    </NeverminedContext.Provider>
  );
};

export const NeverminedContext = createContext({} as NeverminedProviderContext);

// Helper hook to access the provider values
export const useNevermined = (): NeverminedProviderContext => useContext(NeverminedContext);

export default NeverminedProvider;
