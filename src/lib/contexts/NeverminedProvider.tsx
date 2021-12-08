import React, { createContext, useContext } from 'react';
import { Config } from '@nevermined-io/nevermined-sdk-js';

import { useWeb3Service, Web3ServiceContext } from 'lib/contexts/services/Web3Service';
import {
  useNeverminedService,
  NeverminedServiceContext
} from 'lib/contexts/services/NeverminedService';
import { useTokenUtilsService, TokenUtilsServiceContext } from 'lib/contexts/services/TokenUtilsService';

export type NeverminedProviderContext = Web3ServiceContext & NeverminedServiceContext & {services: TokenUtilsServiceContext};

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

  const tokenUtils = useTokenUtilsService(config, web3Context);

  return (
    <NeverminedContext.Provider
      value={
        {
          ...web3Context,
          ...neverminedContext,
          services: {
            ...tokenUtils,
          }
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
