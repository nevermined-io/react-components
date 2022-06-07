import { Config, DDO, Logger, MetaData, Nevermined } from '@nevermined-io/nevermined-sdk-js';
import {
  ContractEventSubscription,
  EventResult
} from '@nevermined-io/nevermined-sdk-js/dist/node/events';
import { QueryResult } from '@nevermined-io/nevermined-sdk-js/dist/node/metadata/Metadata';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AccountModule,
  AssetsModule,
  EventsModule,
  NeverminedProviderContext,
  NeverminedProviderProps,
  NeverminedState,
  OutputUseNeverminedService,
  SubscribeModule
} from './types';
import { initializeNevermined, isEmptyObject, Queries } from './utils';

const DEFAULT_NODE_URI =
  'https://polygon-mumbai.infura.io/v3/eda048626e2745b182f43de61ac70be1'; /** MOVE ME TO NEV **/

export const useNeverminedService = (config: Config): OutputUseNeverminedService => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(undefined);
  const [sdk, setSdk] = useState({} as Nevermined);

  useEffect(() => {
    const loadNevermined = async (): Promise<void> => {
      const sdkAlreadyLoaded = !isEmptyObject(sdk);
      if (isLoading) {
        console.log('Still Trying to loading from previous call');
        return;
      }
      if (!config.web3Provider) {
        console.log('Please include web3 proivder in your sdk config. aborting.');
        return;
      }
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

const initialState: NeverminedState = { currentCase: 'empty', sdk: {} as Nevermined };

const NeverminedProvider = ({ children, config }: NeverminedProviderProps) => {
  const { isLoading, sdk, error } = useNeverminedService(config);

  const account: AccountModule = {
    getReleases: async (address: string): Promise<string[]> => {
      const query = await sdk.keeper.didRegistry.events.getPastEvents({
        eventName: 'DidAttributeRegistered',
        methodName: 'getDIDAttributeRegistereds',
        filterSubgraph: {
          where: { _owner: address },
          orderBy: '_blockNumberUpdated',
          orderDirection: 'desc'
        },
        result: {
          _did: true
        }
      });
      return query.map((item) => item._did);
    },

    getCollection: async (address: string): Promise<string[]> => {
      const query = await sdk?.keeper?.conditions?.transferNftCondition?.events?.getPastEvents({
        eventName: 'Fulfilled',
        methodName: 'getFulfilleds',
        filterSubgraph: { where: { _receiver: address }, orderBy: '_did', orderDirection: 'desc' },
        result: {
          id: true,
          _did: true,
          _receiver: true,
          _agreementId: true,
          _contract: true
        }
      });
      if (!query || query.length == 0) return [];
      const dids = [...new Set(query.map((item) => item))]; //unique items
      return dids;
    }
  };
  const events: EventsModule = {
    fetchAccountTransferEvents: async (address: string): Promise<EventResult> => {
      try {
        const data: any[] = await sdk.keeper.conditions.transferNftCondition.events.getEventData({
          filterSubgraph: {
            where: {
              _receiver: address
            }
          },
          methodName: 'getFulfilleds',
          result: {
            id: true,
            _did: true,
            _agreementId: true,
            _receiver: true
          }
        });
        return data;
      } catch (error) {
        Logger.error(error);
        return [] as any[];
      }
    }
  };

  const assets: AssetsModule = {
    getSingle: async (did: string): Promise<DDO> => {
      try {
        const ddo: DDO = await sdk.assets.resolve(String(did));
        const metaData: MetaData = ddo.findServiceByType('metadata').attributes;
        const nftDetails = await sdk.nfts.details(String(did));
        return ddo;
      } catch (e) {
        Logger.error(e as Error);
        return {} as DDO;
      }
    },

    getAll: async (): Promise<QueryResult> => {
      try {
        const queryResponse: QueryResult = await sdk?.assets?.query(Queries.allAssets());
        return queryResponse;
      } catch (error) {
        console.log('error', error);
        return {} as QueryResult;
      }
    },

    resolve: async (did: string): Promise<DDO | undefined> => {
      const resvoledAsset = await sdk.assets.resolve(did);
      return resvoledAsset;
    }
  };

  const subscribe: SubscribeModule = {
    paymentEvents: (cb: (events: EventResult[]) => void): ContractEventSubscription => {
      const config = {
        filterSubgraph: {},
        methodName: 'getFulfilleds',
        result: {
          id: true,
          _did: true,
          _agreementId: true,
          _amounts: true,
          _receivers: true
        }
      };
      return sdk.keeper.conditions.lockPaymentCondition.events.subscribe(cb, config);
    },

    transferEvents: (cb: (events: EventResult[]) => void): ContractEventSubscription => {
      const config = {
        filterSubgraph: {},
        methodName: 'getFulfilleds',
        result: {
          id: true,
          _did: true,
          _agreementId: true,
          _amounts: true,
          _receivers: true
        }
      };
      return sdk.keeper.conditions.transferNftCondition.events.subscribe(cb, config);
    }
  };

  const IState = {
    sdk,
    subscribe,
    assets,
    account,
    events
  };

  return <NeverminedContext.Provider value={IState}>{children}</NeverminedContext.Provider>;
};

export const NeverminedContext = createContext({} as NeverminedProviderContext);

export const useNevermined = (): NeverminedProviderContext => useContext(NeverminedContext);

export default NeverminedProvider;
