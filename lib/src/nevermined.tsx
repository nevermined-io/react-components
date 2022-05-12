import React, { useState, useEffect, createContext, useContext } from 'react';
import { Nevermined, Config } from '@nevermined-io/nevermined-sdk-js';
import Web3 from 'web3';
import {
  GenericOutput,
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
    const provider: provider = window?.ethereum;
    const web3 = new Web3(isEmptyObject(provider) ? DEFAULT_NODE_URI : provider);
    return web3;
  };
  return handler();
};

export const initializeNevermined = async (
  config: Config
): Promise<GenericOutput<Nevermined, any>> => {
  try {
    console.log('Loading SDK Started..');
    const web3Provider = !isEmptyObject(config.web3Provider)
      ? config.web3Provider
      : getEtheruemProvider();

    const nvmSdk: Nevermined = await Nevermined.getInstance({
      ...config,
      web3Provider
    });
    console.log('Loading SDK Finished Successfully');
    return { data: nvmSdk, error: undefined, success: false };
  } catch (error) {
    console.log('Loading SDK Failed:');
    console.log(error);
    return { data: {} as Nevermined, error, success: false };
  }
};

const useNeverminedService = (config: Config): OutputUseNeverminedService => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(undefined);
  const [sdk, setSdk] = useState({} as Nevermined);

  useEffect(() => {
    const loadNevermined = async (): Promise<void> => {
      const sdkAlreadyLoaded = !isEmptyObject(sdk);
      if (sdkAlreadyLoaded) {
        console.log('SDK already loaded.');
        return;
      }
      setIsLoading(true);
      const { data, success, error } = await initializeNevermined(config);
      if (success) {
        setSdk(data);
        setError(error);
      } else {
        setError(error);
      }
      setIsLoading(false);
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
