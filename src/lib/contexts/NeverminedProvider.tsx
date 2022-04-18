import React, { createContext, useContext } from 'react';
import { Config } from '@nevermined-io/nevermined-sdk-js';
import { Web3ServiceContext } from './services/Web3Service';
import { useNeverminedService, NeverminedServiceContext } from './services/NeverminedService';

export type NeverminedProviderContext = Web3ServiceContext & NeverminedServiceContext;

interface NeverminedProviderProps {
  children: React.ReactNode;
  config: Config;
}
const NeverminedContext = createContext({} as NeverminedProviderContext);

export const NeverminedProvider = ({
  children,
  config
}: NeverminedProviderProps): React.ReactElement => {
  const neverminedContext = useNeverminedService(config);

  return (
    <NeverminedContext.Provider
      value={
        {
          ...neverminedContext
        } as NeverminedProviderContext
      }
    >
      {children}
    </NeverminedContext.Provider>
  );
};

export const useNevermined = (): NeverminedProviderContext => useContext(NeverminedContext);

export default NeverminedProvider;
