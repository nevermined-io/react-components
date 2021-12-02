import React, { createContext, useContext } from 'react';
import { Config } from '@nevermined-io/nevermined-sdk-js';

import { useWeb3Service, Web3ServiceContext } from 'lib/contexts/services/Web3Service';
import {
  useNeverminedService,
  NeverminedServiceContext
} from 'lib/contexts/services/NeverminedService';

export type NeverminedProviderContext = Web3ServiceContext & NeverminedServiceContext;

interface NeverminedProviderProps {
  children: React.ReactNode;
  config: Config;
  shouldReloadOnNetworkChange?: boolean;
}

const NeverminedProvider = ({
  children,
  config,
  shouldReloadOnNetworkChange
}: NeverminedProviderProps): React.ReactElement => {
  const web3Context = useWeb3Service(config, shouldReloadOnNetworkChange);
  const neverminedContext = useNeverminedService(config, web3Context);

  return (
    <NeverminedContext.Provider
      value={
        {
          ...web3Context,
          ...neverminedContext
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
