import {
  Account,
  Config,
  DDO,
  Logger,
  Nevermined,
  SearchQuery,
  ClientError,
} from '@nevermined-io/nevermined-sdk-js';
import { QueryResult } from '@nevermined-io/nevermined-sdk-js/dist/node/metadata/Metadata';
import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import {
  AccountModule,
  AssetsModule,
  ContractEventSubscription,
  EventResult,
  GenericOutput,
  MarketplaceAPIToken,
  NeverminedProviderContext,
  NeverminedProviderProps,
  NFTDetails,
  ERCType,
  SubscribeModule,
  TransferNFTConditionMethod,
  BigNumber
} from './types';
import {
  conductOrder,
  getCurrentAccount,
  isEmptyObject,
  loadFulfilledEvents,
  getAgreementId,
  handlePostRequest
} from './utils';
import { isTokenValid, newMarketplaceApiToken } from './utils/marketplace_token';

const initialState = {
  sdk: {} as Nevermined
};

const neverminedReducer = (
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

/**
 * Nevermined Provider to get the core Catalog functionalities as context
 *
 * @param config -
 * @param verbose - Show Catalog logs in console logs if it sets to `true`
 *
 * @example
 * Initialize NeverminedProvider:
 * ```tsx
 * import React from 'react';
 * import ReactDOM from 'react-dom';
 * import { Catalog } from 'test-catalog-core';
 * import { appConfig } from './config';
 * import Example from 'examples';
 * import { MetaMask } from '@nevermined-io/catalog-providers';
 * import chainConfig, { mumbaiChainId } from './chain_config';
 *
 *
 * ReactDOM.render(
 *   <div>
 *     <Catalog.NeverminedProvider config={appConfig} verbose={true}>
 *       <MetaMask.WalletProvider
 *         externalChainConfig={chainConfig}
 *         correctNetworkId={mumbaiChainId}
 *         nodeUri={String(appConfig.nodeUri)}
 *       >
 *         <Example />
 *       </MetaMask.WalletProvider>
 *     </Catalog.NeverminedProvider>
 *   </div>,
 *   document.getElementById('root') as HTMLElement
 * );
 * ```
 * Once it is intialized then we can execute the hook inside components
 *
 * ```ts
 * const SDKInstance = () => {
 *  const { sdk, isLoadingSDK } = Catalog.useNevermined();
 *
 *  return (
 *    <>
 *      <div>Is Loading SDK</div>
 *      <div>{isLoadingSDK ? 'Yes' : 'No'}</div>
 *      <div>Is SDK Avaialable:</div>
 *      <div>{sdk && Object.keys(sdk).length > 0 ? 'Yes' : 'No'}</div>
 *    </>
 *  );
 *};
 * ```
 */
export const NeverminedProvider = ({ children, config, verbose }: NeverminedProviderProps) => {
  const [{ sdk }, dispatch] = useReducer(neverminedReducer, initialState);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(undefined);

  useEffect(() => {
    const loadNevermined = async (): Promise<void> => {
      if (!config.web3Provider && !config.nodeUri) {
        Logger.log('Please include web3 provider in your sdk config. aborting.');
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
      const { data } = await initializeNevermined({
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
        if (!query || !query.length) return [];
        const dids = [...new Set(query.map((item) => item._did))]; //unique items
        return dids;
      } catch (error) {
        verbose && Logger.error(error);
        return [];
      }
    },

    isAssetHolder: async (
      did: string,
      walletAddress: string,
    ): Promise<boolean> => {
      const purchased = await loadFulfilledEvents(sdk, walletAddress, 'accessCondition');

      const purchasedDDO = await Promise.all(
        purchased.map((asset) => sdk.assets.resolve(asset.documentId))
      );

      const asset = purchasedDDO.filter((p) => p).find((p) => p.id === did);
      return Boolean(asset);
    },

    isNFT1155Holder: async (
      did: string,
      walletAddress: string
    ): Promise<boolean> => {
      const walletAccount = new Account(walletAddress);
      if (walletAccount) {
        const balance = await sdk.nfts.balance(did, walletAccount);
        const nftBalance =  BigNumber.from(balance).toNumber()
        return nftBalance > 0

      }
      return false;
    },

    isNFT721Holder: async (
      nftAddress: string,
      walletAddress: string
    ): Promise<boolean> => {
      if (walletAddress) {
        const walletAccount = new Account(walletAddress);
        const nft721 = await sdk.contracts.loadNft721(nftAddress)
        const balance = await nft721.balanceOf(walletAccount)
        return balance.gt(0)
      }

      return false;
    },
  };

  const assets: AssetsModule = {
    findOne: async (did: string): Promise<DDO> => {
      try {
        if (isEmptyObject(sdk)) return {} as DDO;
        const ddo: DDO = await sdk.assets.resolve(String(did));
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

    transfer: async ({ did, amount }: { did: string; amount: number }): Promise<boolean> => {
      try {
        if (!config.gatewayAddress || !config.gatewayUri) {
          Logger.log('gatewayAddress or gatewayUri is not set. abort.');
          return false;
        }
        const transferEndpoint = `${config.gatewayUri}/api/v1/gateway/services/nft-transfer`;
        const [newOwner] = await sdk.accounts.list();
        if (!newOwner) {
          Logger.log('Users need to be connected to perform a transfer. abort.');
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
          Logger.log('Could not approve spending from new owner wallet. abort.');
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

        Logger.log('Something went wrong! Please try again.');
        return false;
      } catch (e) {
        Logger.error(e);
        return false;
      }
    },

    orderAsset: async (did: string): Promise<string> => {
      const account = await getCurrentAccount(sdk);

      const owner = await sdk.assets.owner(did);

      if (owner === account.getId()) {
        throw new ClientError(
          "You are already the owner, you don't need to order the asset",
          'Catalog'
        );
      }

      const purchased = await loadFulfilledEvents(sdk, account.getId(), 'accessCondition');

      const purchasedDDO = await Promise.all(
        purchased.map((asset) => sdk.assets.resolve(asset.documentId))
      );

      const asset = purchasedDDO.filter((p) => p).find((p) => p.id === did);

      if (asset) {
        return getAgreementId(sdk, 'accessTemplate', did);
      }

      return sdk.assets.order(did, 'access', account);
    },

    orderNFT1155: async (did: string, amount: BigNumber): Promise<string> => {
      const account = await getCurrentAccount(sdk);

      const balance = await sdk.nfts.balance(did, account);

      if (BigNumber.from(balance).toNumber() > 0) {
        return getAgreementId(sdk, 'nftAccessTemplate', did);
      }

      return sdk.nfts.order(did, amount, account);
    },

    orderNFT721: async (did: string, nftTokenAddress: string): Promise<string> => {
      const account = await getCurrentAccount(sdk);

      const holder = await sdk.nfts.ownerOf(did, nftTokenAddress);

      if (holder === account.getId()) {
        return getAgreementId(sdk, 'nft721AccessTemplate', did);
      }

      return sdk.nfts.order721(did, account);
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

        const agreementId = await getAgreementId(sdk, 'accessTemplate', did);

        if ((await sdk.assets.owner(did)) === account.getId()) {
          return Boolean(sdk.assets.download(did, account));
        }

        return sdk.assets.consume(agreementId, did, account);
      } catch (error) {
        verbose && Logger.error(error);
        return false;
      }
    },

    getCustomErc20Token: async (customErc20TokenAddress: string) => {
      const customErc20Token = await sdk.contracts.loadErc20(customErc20TokenAddress);
      const account = await getCurrentAccount(sdk);

      return {
        name: await customErc20Token.name(),
        symbol: await customErc20Token.symbol(),
        decimals: await customErc20Token.decimals(),
        balance: await customErc20Token.balanceOf(account.getId())
      };
    },

    uploadAssetToFilecoin: async (file: File, filecoinUrl: string) => {
      const form = new FormData();
      form.append('file', file);

      const gatewayUploadUrl = `${config.gatewayUri}${filecoinUrl}`;

      const response = await handlePostRequest(gatewayUploadUrl, form);

      return response.url;
    }
  };

  const subscribe: SubscribeModule = {
    paymentEvents: (cb: (events: EventResult[]) => void): ContractEventSubscription => {
      try {
        const config = {
          filterSubgraph: {},
          eventName: 'Fulfilled',
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

    transferEvents: (cb: (events: EventResult[]) => void, ercType: ERCType = 1155): ContractEventSubscription => {
      try {
        const config = {
          filterSubgraph: {},
          methodName: 'getFulfilleds',
          eventName: 'Fulfilled',
          result: {
            id: true,
            _did: true,
            _agreementId: true,
            _amount: true,
            _receiver: true
          }
        };
        return sdk.keeper.conditions[ercType === 721 ? TransferNFTConditionMethod.nft721 : TransferNFTConditionMethod.nft1155].events.subscribe(cb, config);
      } catch (error) {
        verbose && Logger.error(error);
        return {} as ContractEventSubscription;
      }
    }
  };

  const subscription = {
    buySubscription: async (subscriptionDid: string, buyer: Account, nftHolder: string, nftAmount: BigNumber, ercType: ERCType): Promise<string> => {
      let agreementId;
      let transferResult;
      try {
        agreementId = ercType === 721 ? await sdk.nfts.order721(subscriptionDid, buyer): await sdk.nfts.order(subscriptionDid, BigNumber.from(nftAmount), buyer);
        transferResult = await sdk.nfts.transferForDelegate(
          agreementId,
          nftHolder,
          buyer.getId(),
          nftAmount,
          ercType
        );
      } catch (error) {
        verbose && Logger.error(error);
        throw error
      }

      if (!transferResult)
        throw new Error("Error delegating the NFT of the subscription with agreement " + agreementId)

      return agreementId

    },

  };


  const IState = {
    sdk,
    isLoadingSDK: isLoading,
    sdkError: error,
    subscribe,
    assets,
    account,
    updateSDK,
    subscription
  };

  return <NeverminedContext.Provider value={IState}>{children}</NeverminedContext.Provider>;
};

export const NeverminedContext = createContext({} as NeverminedProviderContext);

export const useNevermined = (): NeverminedProviderContext => {
  const contextValue = useContext(NeverminedContext);

  if (!contextValue) {
    throw new Error(
      'could not find Nevermined context value; please ensure the component is wrapped in a <NeverminedProvider>'
    )
  }

  return contextValue;
}
