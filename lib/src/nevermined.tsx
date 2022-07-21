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
import { isEmptyObject, getCurrentAccount, conductOrder } from './utils';
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
    Logger.log('Loading SDK Started..');
    const nvmSdk: Nevermined = await Nevermined.getInstance({
      ...config
    });
    Logger.log('Loading SDK Finished Successfully');
    return { data: nvmSdk, error: undefined, success: true };
  } catch (error) {
    Logger.log('Loading SDK Failed:');
    Logger.log(error);
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
        Logger.log('Please include web3 proivder in your sdk config. aborting.');
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

  const accountModule: AccountModule = {
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
          Logger.log('No account was found!');
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

    transfer: async ({ did, amount }: { did: string; amount: number }): Promise<boolean> => {
      try {
        if (!config.gatewayAddress || !config.gatewayUri) {
          Logger.log(`gatewayAddress or gatewayUri is not set. abort.`);
          return false;
        }
        const transferEndpoint = `${config.gatewayUri}/api/v1/gateway/services/nft-transfer`;
        const [newOwner] = await sdk.accounts.list();
        if (!newOwner) {
          Logger.log(`Users need to be connected to perform a transfer. abort.`);
          return false;
        }
        const ddo: DDO = await sdk.assets.resolve(String(did));
        const currentOwner = await sdk.assets.owner(ddo.id); // Get current owner
        const agreementId = await conductOrder({
          sdk,
          ddo,
          gatewayAddress: config.gatewayAddress,
          newOwner
        });
        await new Promise((r) => setTimeout(r, 3000)); // await two seconds to allow the transaction to be processed
        if (!agreementId) {
          Logger.log(`Could not approve spending from new owner wallet. abort.`);
          return false;
        }
        Logger.log(`Obtained agreement ID ${agreementId}`);
        const isTransferSuccessful = await sdk.utils.fetch.post(
          transferEndpoint,
          JSON.stringify({
            agreementId,
            nftAmount: amount,
            nftHolder: new Account(currentOwner).getId(),
            nftReceiver: newOwner.getId()
          })
        );
        if (isTransferSuccessful) {
          Logger.log(`Transferred ${amount} NFT with did ${ddo.id} to ${newOwner.getId()}`);
          return true;
        } 

        Logger.log(`Something went wrong! Please try again.`);
        return false;
      } catch (e) {
        Logger.error(e);
        return false;
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
        return sdk.nfts.details(did);
      } catch (error) {
        verbose && Logger.error(error);
        return {} as NFTDetails;
      }
    },

    downloadNFT: async (did: string): Promise<boolean> => {
      try {
        const account = await getCurrentAccount(sdk);
        return sdk.nfts.access(did, account);
      } catch (error) {
        verbose && Logger.error(error);
        return false;
      }
    },

    downloadAsset: async (did: string): Promise<boolean> => {
      try {
        const account = await getCurrentAccount(sdk);
        return sdk.assets.download(did, account);
      } catch (error) {
        verbose && Logger.error(error);
        return false;
      }
    },

    consumeAsset: async (did: string, agreementId: string): Promise<boolean> => {
      try {
        const account = await getCurrentAccount(sdk);
        return sdk.assets.consume(agreementId, did, account);
      } catch (error) {
        verbose && Logger.error(error);
        return false;
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
    account: accountModule,
    events,
    updateSDK,
  };

  return <NeverminedContext.Provider value={IState}>{children}</NeverminedContext.Provider>;
};

export const NeverminedContext = createContext({} as NeverminedProviderContext);

export const useNevermined = (): NeverminedProviderContext => useContext(NeverminedContext);
