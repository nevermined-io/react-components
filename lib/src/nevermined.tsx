import {
  ContractEventSubscription,
  EventResult
} from '@nevermined-io/nevermined-sdk-js/dist/node/events';

import React, { useState, useEffect, createContext, useContext, useReducer } from 'react';
import {
  Nevermined,
  Account,
  Logger,
  Config,
  MetaData,
  DDO,
  SearchQuery
} from '@nevermined-io/nevermined-sdk-js';
import {
  AssetState,
  CollectionItem,
  GenericOutput,
  NeverminedProviderContext,
  NeverminedProviderProps,
  NeverminedState,
  OutputUseNeverminedService
} from './types';
import {
  calculateAssetPrice,
  findCoverForAsset,
  formatArtwork,
  getItemsFromDids,
  isEmptyObject,
  Queries,
  truthy,
  unwrapNeverminedMetaData
} from './utils';
import queryBuilder from './utils/query-builder';
import { QueryResult } from '@nevermined-io/nevermined-sdk-js/dist/node/metadata/Metadata';
import { ServiceCommon } from '@nevermined-io/nevermined-sdk-js/dist/node/ddo/Service';

const DEFAULT_NODE_URI =
  'https://polygon-mumbai.infura.io/v3/eda048626e2745b182f43de61ac70be1'; /** MOVE ME TO NEV **/

export const initializeNevermined = async (
  config: Config
): Promise<GenericOutput<Nevermined, any>> => {
  try {
    console.log('Loading SDK Started..');
    const nvmSdk: Nevermined = await Nevermined.getInstance({
      ...config
    });
    console.log('Loading SDK Finished Successfully');
    return { data: nvmSdk, error: undefined, success: false };
  } catch (error) {
    console.log('Loading SDK Failed:');
    console.log(error);
    return { data: {} as Nevermined, error, success: false };
  }
};
const getReleasesOfAccount = async (
  account: string,
  sdk: Nevermined
): Promise<CollectionItem[]> => {
  if (!account) return [];
  const dids = await getAssetsReleasedByAddress(account, sdk);
  return getItemsFromDids(dids, sdk);
};

const getAssetsReleasedByAddress = async (address: string, sdk: Nevermined): Promise<string[]> => {
  if (sdk && sdk.keeper) {
    const query = await sdk.keeper.didRegistry.events.getPastEvents({
      eventName: 'DidAttributeRegistered',
      methodName: 'getDIDAttributeRegistereds',
      filterSubgraph: {
        where: { _owner: address },
        orderBy: '_blockNumberUpdated',
        orderDirection: 'desc'
      },
      result: {
        id: true,
        _did: true,
        _owner: true,
        _blockNumberUpdated: true,
        _lastUpdatedBy: true
      }
    });

    return query.map((item) => item._did);
  } else return [];
};

const getAssetsReceivedByAddress = async (
  address: string,
  sdk: Nevermined
): Promise<{ _did: string; timestamp: number }[]> => {
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

  return query;
};

const reducer = (state: NeverminedState, action: { type: string; payload: Nevermined }) => {
  switch (action.type) {
    case 'init':
      return { currentCase: 'init', sdk: action.payload };
    default:
      return state;
  }
};

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

const initialState: NeverminedState = { currentCase: 'empty', sdk: {} as Nevermined };

const NeverminedProvider = ({ children, config }: NeverminedProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { sdk } = state;

  useEffect(() => {
    const handler = async () => {
      if (!config.web3Provider) {
        console.log('Please include web3 proivder in your sdk config. aborting.');
        return;
      }

      const { data, success, error } = await initializeNevermined(config);
      if (success) {
        dispatch({ type: 'init', payload: data });
      }
    };
    handler();
  }, []);

  const useAccountReleases = (
    id: string
  ): { isLoading: boolean; accountReleases: CollectionItem[] } => {
    const [accountReleases, setAccountReleases] = useState<CollectionItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
      const loadReleases = async (): Promise<void> => {
        setIsLoading(true);
        const releasesTemp = await getReleasesOfAccount(id, sdk);
        setAccountReleases(
          releasesTemp.sort((a, b) => {
            if (
              a.artwork.findServiceByType('metadata').attributes.main.dateCreated <
              b.artwork.findServiceByType('metadata').attributes.main.dateCreated
            ) {
              return 1;
            }
            if (
              a.artwork.findServiceByType('metadata').attributes.main.dateCreated >
              b.artwork.findServiceByType('metadata').attributes.main.dateCreated
            ) {
              return -1;
            }
            return 0;
          })
        );
        setIsLoading(false);
      };
      loadReleases();
    }, [id, sdk]);

    return { isLoading, accountReleases };
  };

  const useAccountCollection = (
    id: string
  ): { isLoading: boolean; accountCollection: (CollectionItem & { txTimestamp: number })[] } => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [accountCollection, setAccountCollection] = useState<
      (CollectionItem & { txTimestamp: number })[]
    >([]);
    const filterItemListForAccount = async (
      account: Account,
      items: (CollectionItem & { txTimestamp: number })[]
    ): Promise<(CollectionItem & { txTimestamp: number })[]> => {
      const assetsOfAccount: (CollectionItem & { txTimestamp: number })[] = [];
      await Promise.all(
        items.map(async (item) => {
          const balanceOfAccount = await sdk.nfts.balance(item.artwork.id, account);
          if (balanceOfAccount > 0) {
            assetsOfAccount.push(item);
          }
        })
      );
      return assetsOfAccount;
    };
    const getItemFromDid = async (did: string) => {
      try {
        const asset = await sdk.assets.resolve(did);
        if (!asset || !asset.findServiceByType('metadata')) return undefined;
        const unwrapped = unwrapNeverminedMetaData(asset.findServiceByType('metadata').attributes);
        const coverUrl = unwrapped.autonomies?.coverUrl;
        if (coverUrl) {
          return {
            artwork: asset,
            cover: coverUrl,
            secondaryAgreements: [],
            price: +unwrapped.main.price
          } as CollectionItem;
        }
        return undefined;
      } catch (error) {
        console.log('error resolving did', error);
      }
      return undefined;
    };
    const getAssetsOfAccount = async (
      account: string
    ): Promise<(CollectionItem & { txTimestamp: number })[]> => {
      const dids = await getAssetsReceivedByAddress(account, sdk);
      const uniqueDids = [...new Set(dids.map((item) => item))];
      const items: (CollectionItem & { txTimestamp: number })[] = [];
      for (let i = 0; i < uniqueDids.length; i++) {
        const did = uniqueDids[i];
        const item = await getItemFromDid(did._did);
        if (item) items.push({ ...item, txTimestamp: did.timestamp });
      }
      const result = await filterItemListForAccount(new Account(account), items);

      return result.sort((a, b) => b.txTimestamp - a.txTimestamp);
    };

    useEffect(() => {
      const loadCollection = async (): Promise<void> => {
        if (!id || !sdk.utils) return;
        setLoading(true);
        const collection = await getAssetsOfAccount(id);
        setAccountCollection(collection);
        console.log(collection);
        setLoading(false);
      };
      loadCollection();
    }, [id, sdk]);

    return { isLoading, accountCollection };
  };

  const usePaymentEvents = () => {
    const [paymentEvents, setPaymentEvents] = useState([] as EventResult[]);
    const [isLoadingPaymentEvents, setIsLoadingPaymentEvents] = useState(false);

    useEffect(() => {
      const getPayments = async () => {
        if (sdk && sdk.keeper) {
          try {
            setIsLoadingPaymentEvents(true);
            const lockEventData =
              await sdk.keeper.conditions.lockPaymentCondition.events.getEventData({
                filterSubgraph: {},
                methodName: 'getFulfilleds',
                result: {
                  id: true,
                  _did: true,
                  _agreementId: true,
                  _amounts: true,
                  _receivers: true
                }
              });
            setPaymentEvents(lockEventData);
          } catch (error) {
            Logger.error(error);
          }
        }
        setIsLoadingPaymentEvents(false);
      };
      getPayments();
    }, [sdk]);

    return { paymentEvents, isLoadingPaymentEvents };
  };

  const useUserTransferEvents = (account: Account) => {
    const [transferEvents, setTransferEvents] = useState([] as EventResult[]);
    const [isLoadingTransferEvents, setIsLoadingTransferEvents] = useState(false);

    useEffect(() => {
      const getTransfers = async () => {
        if (sdk && sdk.keeper && account && account.getId) {
          try {
            setIsLoadingTransferEvents(true);
            const data = await sdk.keeper.conditions.transferNftCondition.events.getEventData({
              filterSubgraph: {
                where: {
                  _receiver: account.getId()
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
            setTransferEvents(data);
          } catch (error) {
            Logger.error(error);
          }
          setIsLoadingTransferEvents(false);
        }
      };
      getTransfers();
    }, [sdk]);

    return { isLoadingTransferEvents, transferEvents };
  };

  const useFetchAssetData = (did: string): AssetState => {
    const [state, setState] = useState<AssetState>({
      ddo: {} as DDO,
      metadata: {
        main: {
          name: ''
        }
      } as MetaData,
      error: '',
      isLoading: true,
      nftDetails: {} as any
    });

    useEffect(() => {
      const getData = async () => {
        try {
          if (!isEmptyObject(sdk) && sdk.assets) {
            const ddo: DDO = await sdk.assets.resolve(did);
            const metaData: MetaData = ddo.findServiceByType('metadata').attributes;
            const nftDetails = await sdk.nfts.details(did);
            setState({
              ddo,
              metadata: metaData,
              nftDetails,
              error: '',
              isLoading: false,
              main: {}
            } as AssetState);
          }
        } catch (e) {
          Logger.error(e as Error);
        }
      };
      getData();
    }, [did, sdk, sdk.assets, sdk.nfts]);

    return state;
  };

  const useAllAssets = (): {
    allArtwork: CollectionItem[];
    isLoading: boolean;
    handler: any;
  } => {
    const decimals = 18;
    const [isLoading, setIsLoading] = useState(false);
    const [allArtwork, setAllArtwork] = useState<CollectionItem[]>([]);

    const handler = async () => {
      if (!sdk?.assets) {
        return;
      }
      setIsLoading(true);
      try {
        const queryResponse: QueryResult = await sdk?.assets?.query(Queries.allAssets());
        const artworks: (CollectionItem | undefined)[] = await Promise.all(
          queryResponse?.results?.map(async (artwork: DDO): Promise<CollectionItem | undefined> => {
            try {
              const resvoledAsset = await sdk.assets.resolve(artwork.id);
              if (!resvoledAsset) return undefined;
              const formattedArtwork = await formatArtwork(artwork, decimals);
              return {
                ...formattedArtwork
              };
            } catch (error) {
              return undefined;
            }
          })
        );

        const aws = artworks?.length ? artworks.filter(truthy) : [];
        console.log('aws', aws);
        //@ts-ignore
        setAllArtwork(aws);
        setIsLoading(false);
      } catch (error) {
        Logger.error(error);
        setIsLoading(false);
      }
    };

    useEffect(() => {
      if (isLoading) return;
      handler();
    }, [sdk, decimals]);

    return {
      allArtwork,
      handler,
      isLoading: isLoading || !sdk?.assets
    };
  };

  const useSubscribeToPaymentEvents = () => {
    const [paymentSubscription, setPaymentSubscription] = useState<ContractEventSubscription>();
    const [paymentEvents, setPaymentEvents] = useState([] as EventResult[]);

    useEffect(() => {
      if (sdk && sdk.keeper) {
        const paymentSubscriptionTemp = sdk.keeper.conditions.lockPaymentCondition.events.subscribe(
          (events) => {
            setPaymentEvents(events);
          },
          {
            filterSubgraph: {},
            methodName: 'getFulfilleds',
            result: {
              id: true,
              _did: true,
              _agreementId: true,
              _amounts: true,
              _receivers: true
            }
          }
        );
        setPaymentSubscription(paymentSubscriptionTemp);
      }
      return () => paymentSubscription?.unsubscribe();
    }, [sdk]);

    return { paymentEvents, paymentSubscription };
  };

  const useSubscribeToTransferEvents = () => {
    const [transferSubscription, setTransferSubscription] = useState<ContractEventSubscription>();
    const [transferEvents, setTransferEvents] = useState([] as EventResult[]);

    useEffect(() => {
      if (sdk && sdk.keeper) {
        const response = sdk.keeper.conditions.transferNftCondition.events.subscribe(
          (events) => {
            setTransferEvents(events);
          },
          {
            filterSubgraph: {},
            methodName: 'getFulfilleds',
            result: {
              id: true,
              _did: true,
              _agreementId: true,
              _amount: true,
              _receiver: true
            }
          }
        );
        setTransferSubscription(response);
      }

      return () => transferSubscription?.unsubscribe();
    }, [sdk]);

    return { transferEvents, transferSubscription };
  };

  const IState = {
    sdk: state.sdk,
    useFetchAssetData,
    useAllAssets,
    useSubscribeToPaymentEvents,
    useSubscribeToTransferEvents,
    useAccountCollection,
    useAccountReleases,
    usePaymentEvents,
    useUserTransferEvents
  };

  return <NeverminedContext.Provider value={IState}>{children}</NeverminedContext.Provider>;
};

/** helper **/
export const useNevermined = (): NeverminedProviderContext => useContext(NeverminedContext);

export default NeverminedProvider;
