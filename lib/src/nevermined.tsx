import React, { useState, useEffect, createContext, useContext } from 'react';
import { Nevermined, Config } from '@nevermined-io/nevermined-sdk-js';
import Web3 from 'web3';
import {
  NeverminedProviderContext,
  NeverminedProviderProps,
  OutputUseNeverminedService
} from './types';
import { isEmptyObject } from './utils';
import { provider } from 'web3-core';

const DEFAULT_NODE_URI =
  'https://polygon-mumbai.infura.io/v3/eda048626e2745b182f43de61ac70be1'; /** MOVE ME TO NEV **/

export const getEtheruemProvider = () => {
  const handler = (): Web3 => {
    const provider: provider = window.ethereum;
    const web3 = new Web3(isEmptyObject(provider) ? DEFAULT_NODE_URI : provider);

    return web3;
  };

  return handler();
};

const useNeverminedService = (config: Config): OutputUseNeverminedService => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(undefined);
  const [sdk, setSdk] = useState({} as Nevermined);

  useEffect(() => {
    const loadNevermined = async (): Promise<void> => {
      try {
        const sdkAlreadyLoaded = !isEmptyObject(sdk);
        if (sdkAlreadyLoaded) {
          console.log('SDK already loaded. Aborting reload.');
          console.log(sdk);
          return;
        }

        const web3Provider = !isEmptyObject(config.web3Provider)
          ? config.web3Provider
          : getEtheruemProvider();

        const nvmSdk: any = await Nevermined.getInstance({
          ...config,
          web3Provider
        });
        setSdk(nvmSdk);
        console.log('Loading SDK Finished:', nvmSdk);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        console.log(error);
      }
    };
    loadNevermined();
  }, [config, sdk]);

  return {
    isLoading,
    sdk,
    error
  };
};

export const NeverminedContext = createContext({} as NeverminedProviderContext);

const NeverminedProvider = ({ children, config }: NeverminedProviderProps): React.ReactElement => {
  const { sdk } = useNeverminedService(config);

  return (
    <NeverminedContext.Provider value={{ sdk } as NeverminedProviderContext}>
      {children}
    </NeverminedContext.Provider>
  );
};

/** helper **/
export const useNevermined = (): NeverminedProviderContext => useContext(NeverminedContext);

export default NeverminedProvider;
