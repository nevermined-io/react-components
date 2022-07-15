import {
  Config,
  DDO,
  Logger,
  MetaData,
  Nevermined,
  SearchQuery
} from '@nevermined-io/nevermined-sdk-js';
import {
  ContractEventSubscription,
  EventResult
} from '@nevermined-io/nevermined-sdk-js/dist/node/events';
import { QueryResult } from '@nevermined-io/nevermined-sdk-js/dist/node/metadata/Metadata';
import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import {
  AccountModule,
  AssetsModule,
  EventsModule,
  GenericOutput,
  MarketplaceAPIToken,
  MintNFTInput,
  NeverminedProviderContext,
  NeverminedProviderProps,
  NFTDetails,
  SubscribeModule,
} from './types';
import { isEmptyObject } from './utils';
import { isTokenValid, newMarketplaceApiToken } from './utils/marketplace_token';

export const initialState = {
  sdk: {} as Nevermined
};

export const neverminedReducer = (
  state: { sdk: Nevermined },
  action: { type: 'SET_SDK'; payload: { sdk: Nevermined } }
) => {
  switch (action.type) {
    case 'SET_SDK':
      return { ...action.payload };
    default:
      return state;
  }
};

export const initializeNevermined = async (
  config: Config
): Promise<GenericOutput<Nevermined, any>> => {
  try {
    console.log('Loading SDK Started..');
    const nvmSdk: Nevermined = await Nevermined.getInstance({
      ...config
    });
    console.log('Loading SDK Finished Successfully');
    return { data: nvmSdk, error: undefined, success: true };
  } catch (error) {
    console.log('Loading SDK Failed:');
    console.log(error);
    return { data: {} as Nevermined, error, success: false };
  }
};

export const NeverminedProvider = ({ children, config, verbose }: NeverminedProviderProps) => {
  const [{ sdk }, dispatch] = useReducer(neverminedReducer, initialState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(undefined);

  // Invoked on start to initialise the SDK
  // if you want to change the sdk based on user interaction
  // you can use UpdateSDK functin exported from this provider
  useEffect(() => {
    const loadNevermined = async (): Promise<void> => {
      if (!config.web3Provider) {
        console.log('Please include web3 proivder in your sdk config. aborting.');
        return;
      }
      setIsLoading(true);
      const { data, success, error } = await initializeNevermined(config);
      if (success) {
        dispatch({ type: 'SET_SDK', payload: { sdk: data } });
      }
      setError(error);
      setIsLoading(false);
    };
    loadNevermined();
  }, [config]);

  const updateSDK = async (newConfig: Config): Promise<boolean> => {
    const newSDK = await initializeNevermined({ ...config, ...newConfig });
    if (newSDK.success) {
      dispatch({ type: 'SET_SDK', payload: { sdk: newSDK.data } });
    }
    return newSDK.success;
  };

  const account: AccountModule = {
    isTokenValid: (): boolean => isTokenValid(),

    generateToken: async (): Promise<MarketplaceAPIToken> => {
      const tokenData = await newMarketplaceApiToken(sdk);
      const { data, success } = await initializeNevermined({
        ...config,
        marketplaceAuthToken: tokenData.token
      });
      dispatch({ type: 'SET_SDK', payload: { sdk: data } });
      return tokenData;
    },

    getReleases: async (address: string): Promise<string[]> => {
      try {
        const query: { _did: string }[] = await sdk.keeper.didRegistry.events.getPastEvents({
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
        return query?.map((item) => item._did) || [];
      } catch (error) {
        verbose && Logger.error(error);
        return [];
      }
    },

    getCollection: async (address: string): Promise<string[]> => {
      try {
        const query: {
          _did: string;
        }[] = await sdk?.keeper?.conditions?.transferNftCondition?.events?.getPastEvents({
          eventName: 'Fulfilled',
          methodName: 'getFulfilleds',
          filterSubgraph: {
            where: { _receiver: address },
            orderBy: '_did',
            orderDirection: 'desc'
          },
          result: {
            _did: true
          }
        });
        if (!query || query.length == 0) return [];
        const dids = [...new Set(query.map((item) => item._did))]; //unique items
        return dids;
      } catch (error) {
        verbose && Logger.error(error);
        return [];
      }
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
        verbose && Logger.error(error);
        return [] as any[];
      }
    }
  };

  const assets: AssetsModule = {
    getSingle: async (did: string): Promise<DDO> => {
      try {
        if (isEmptyObject(sdk)) return {} as DDO;
        const ddo: DDO = await sdk.assets.resolve(String(did));
        const metaData: MetaData = ddo.findServiceByType('metadata').attributes;
        const nftDetails = await sdk.nfts.details(String(did));
        return ddo;
      } catch (e) {
        verbose && Logger.error(error);
        return {} as DDO;
      }
    },

    query: async (q: SearchQuery): Promise<QueryResult> => {
      try {
        if (isEmptyObject(sdk)) return {} as QueryResult;
        const queryResponse: QueryResult = await sdk?.assets.query(q);
        return queryResponse;
      } catch (error) {
        verbose && Logger.error(error);
        return {} as QueryResult;
      }
    },

    mint: async (input: MintNFTInput): Promise<DDO | undefined> => {
      try {
        if (isEmptyObject(sdk)) return undefined;
        const [publisherAddress] = await sdk.accounts.list();
        if (!publisherAddress) {
          console.log('No account was found!');
          return;
        }
        const minted: DDO = await sdk.nfts.create(
          input.metadata,
          publisherAddress,
          input.cap,
          input.royalties,
          input.assetRewards,
          input.nftAmount || undefined,
          input.erc20TokenAddress || undefined,
          input.preMint || false,
          input.nftMetadata || undefined, // uri
          input.txParams || undefined
        );
        return minted;
      } catch (error) {
        verbose && Logger.error(error);
        return undefined;
      }
    },

    resolve: async (did: string): Promise<DDO | undefined> => {
      try {
        if (isEmptyObject(sdk)) return undefined;
        const resvoledAsset = await sdk.assets.resolve(did);
        return resvoledAsset;
      } catch (error) {
        verbose && Logger.error(error);
        return undefined;
      }
    },

    nftDetails: async (did: string): Promise<NFTDetails> => {
      try {
        if (isEmptyObject(sdk)) return {} as NFTDetails;
        const details = sdk.nfts.details(did);
        return details;
      } catch (error) {
        verbose && Logger.error(error);
        return {} as NFTDetails;
      }
    }
  };

  const subscribe: SubscribeModule = {
    paymentEvents: (cb: (events: EventResult[]) => void): ContractEventSubscription => {
      try {
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
      } catch (error) {
        verbose && Logger.error(error);
        return {} as ContractEventSubscription;
      }
    },

    transferEvents: (cb: (events: EventResult[]) => void): ContractEventSubscription => {
      try {
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
      } catch (error) {
        verbose && Logger.error(error);
        return {} as ContractEventSubscription;
      }
    }
  };

  const IState = {
    sdk,
    isLoadingSDK: isLoading,
    sdkError: error,
    subscribe,
    assets,
    account,
    events,
    updateSDK,
    config,
  };

  return <NeverminedContext.Provider value={IState}>{children}</NeverminedContext.Provider>;
};

export const NeverminedContext = createContext({} as NeverminedProviderContext);

export const useNevermined = (): NeverminedProviderContext => useContext(NeverminedContext);
