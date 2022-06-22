import {
  Account,
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
import { TxParameters } from '@nevermined-io/nevermined-sdk-js/dist/node/keeper/contracts/ContractBase';
import { QueryResult } from '@nevermined-io/nevermined-sdk-js/dist/node/metadata/Metadata';
import AssetRewards from '@nevermined-io/nevermined-sdk-js/dist/node/models/AssetRewards';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AccountModule,
  AssetsModule,
  EventsModule,
  GenericOutput,
  MintNFTInput,
  NeverminedProviderContext,
  NeverminedProviderProps,
  NFTDetails,
  OutputUseNeverminedService,
  SubscribeModule
} from './types';
import { isEmptyObject } from './utils';

const initializeNevermined = async (config: Config): Promise<GenericOutput<Nevermined, any>> => {
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
  const useNeverminedService = (config: Config): OutputUseNeverminedService => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(undefined);
    const [sdk, setSdk] = useState({} as Nevermined);

    useEffect(() => {
      const loadNevermined = async (): Promise<void> => {
        const isAlreadyLoaded = () => sdk && Object.keys(sdk).length > 0;
        if (!config.web3Provider) {
          console.log('Please include web3 proivder in your sdk config. aborting.');
          return;
        }
        if (isAlreadyLoaded()) {
          console.log('SDK is already loaded. aborting');
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
    }, [config]);

    return {
      isLoading,
      sdk,
      error
    };
  };

  const { isLoading, sdk, error } = useNeverminedService(config);

  const account: AccountModule = {
    getReleases: async (address: string): Promise<string[]> => {
      try {
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
      } catch (error) {
        verbose && Logger.error(error);
        return [];
      }
    },

    getCollection: async (address: string): Promise<string[]> => {
      try {
        const query = await sdk?.keeper?.conditions?.transferNftCondition?.events?.getPastEvents({
          eventName: 'Fulfilled',
          methodName: 'getFulfilleds',
          filterSubgraph: {
            where: { _receiver: address },
            orderBy: '_did',
            orderDirection: 'desc'
          },
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
        const minted: DDO = await sdk.nfts.create(
          input.metadata,
          input.publisher,
          input.cap,
          input.royalties,
          input.assetRewards,
          input.nftAmount,
          input.erc20TokenAddress,
          input.preMint,
          input.nftMetadata,
          input.txParams
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
    subscribe,
    assets,
    account,
    events
  };

  return <NeverminedContext.Provider value={IState}>{children}</NeverminedContext.Provider>;
};

export const NeverminedContext = createContext({} as NeverminedProviderContext);

export const useNevermined = (): NeverminedProviderContext => useContext(NeverminedContext);
