import React, { createContext, useContext, useEffect, useReducer, useState } from 'react'
import {
  Account,
  NeverminedOptions,
  DDO,
  Logger,
  Nevermined,
  SearchQuery,
  ClientError,
  QueryResult,
  AccountModule,
  AssetsModule,
  ContractEventSubscription,
  EventResult,
  GenericOutput,
  NeverminedProviderContext,
  NeverminedProviderProps,
  NFTDetails,
  ERCType,
  SubscribeModule,
  TransferNFTConditionMethod,
  BigNumber,
  SubscriptionsAndServicesDDOs,
  OrderProgressStep,
  SubscriptionsAndDatasetsDDOs,
  SearchOptions,
} from './types'
import {
  conductOrder,
  isEmptyObject,
  loadFulfilledEvents,
  getAgreementId,
  handlePostRequest,
  getSubscriptionsAndServices,
  getSubscriptionsAndDatasets,
  executeWithProgressEvent,
  emptyQueryResult,
} from './utils'
import { _getCryptoConfig, _getDTPInstance, _grantAccess } from './utils/dtp'
import {
  fetchMarketplaceApiTokenFromLocalStorage,
  isTokenValid,
  newMarketplaceApiToken,
} from './utils/marketplace_token'
import { TransferError } from './exceptions/transfer-exception'
import { LockPaymentError } from './exceptions/lockpayment-exceptions'

const initialState = {
  sdk: {} as Nevermined,
}

const neverminedReducer = (
  state: { sdk: Nevermined },
  action: { type: 'SET_SDK'; payload: { sdk: Nevermined } },
) => {
  switch (action.type) {
    case 'SET_SDK':
      return { ...action.payload }
    default:
      return state
  }
}

export const initializeNevermined = async (
  config: NeverminedOptions,
): Promise<GenericOutput<Nevermined, any>> => {
  // eslint-disable-line
  try {
    Logger.log('Loading SDK Started..')
    const nvmSdk: Nevermined = await Nevermined.getInstance({
      ...config,
    })
    Logger.log('Loading SDK Finished Successfully')
    return { data: nvmSdk, error: undefined, success: true }
  } catch (error) {
    Logger.log('Loading SDK Failed:')
    Logger.log(error)
    return { data: {} as Nevermined, error, success: false }
  }
}

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
 * import { Catalog } from '@nevermined-io/catalog';
 * import { appConfig } from './config';
 * import Example from 'examples';
 * import { MetaMask } from '@nevermined-io/providers';
 * import chainConfig, { mumbaiChainId } from './chain_config';
 *
 *
 * ReactDOM.render(
 *   <div>
 *     <Catalog.NeverminedProvider config={appConfig} verbose={true}>
 *       <WalletProvider
 *          client={getClient()}
 *       >
 *         <Example />
 *       </WalletProvider>
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
  const [{ sdk }, dispatch] = useReducer(neverminedReducer, initialState)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  // eslint-disable-next-line
  const [sdkError, setSdkError] = useState<any>(undefined)

  useEffect(() => {
    const loadNevermined = async (): Promise<void> => {
      if (!config.web3Provider && !config.neverminedNodeUri) {
        Logger.log('Please include web3 provider in your sdk config. aborting.')
        return
      }
      setIsLoading(true)
      const { data, success, error } = await initializeNevermined(config)
      if (success) {
        dispatch({ type: 'SET_SDK', payload: { sdk: data } })
      }
      setSdkError(error)
      setIsLoading(false)
    }
    loadNevermined()
  }, [config])

  const updateSDK = async (newConfig: NeverminedOptions): Promise<boolean> => {
    const newSDK = await initializeNevermined({ ...config, ...newConfig })
    if (newSDK.success) {
      dispatch({ type: 'SET_SDK', payload: { sdk: newSDK.data } })
    }
    return newSDK.success
  }

  const account: AccountModule = {
    isTokenValid: (address: string, chainId: number): boolean => isTokenValid({ address, chainId }),
    generateToken: async ({
      address,
      chainId,
      message,
    }: {
      address: string
      chainId: number
      message?: string
    }): Promise<string> => {
      const tokenExists = await newMarketplaceApiToken({ sdk, chainId, address, message })
      if (!tokenExists) {
        return ''
      }

      const token = fetchMarketplaceApiTokenFromLocalStorage({ address, chainId }) as string
      const { data } = await initializeNevermined({
        ...config,
        marketplaceAuthToken: token,
      })
      dispatch({ type: 'SET_SDK', payload: { sdk: data } })
      return token
    },
    getReleases: async (address: string): Promise<string[]> => {
      try {
        const query: { _did: string }[] = await sdk.keeper.didRegistry.events.getPastEvents({
          eventName: 'DidAttributeRegistered',
          filterSubgraph: {
            where: { _owner: address },
            orderBy: '_blockNumberUpdated',
            orderDirection: 'desc',
          },
          result: {
            _did: true,
          },
        })
        return query?.map((item) => item._did) || []
      } catch (error) {
        verbose && Logger.error(error)
        return []
      }
    },

    getCollection: async (address: string): Promise<string[]> => {
      try {
        const query: {
          _did: string
        }[] = await sdk?.keeper?.conditions?.transferNftCondition?.events?.getPastEvents({
          eventName: 'Fulfilled',
          filterSubgraph: {
            where: { _receiver: address },
            orderBy: '_did',
            orderDirection: 'desc',
          },
          result: {
            _did: true,
          },
        })
        if (!query || !query.length) return []
        const dids = [...new Set(query.map((item) => item._did))] //unique items
        return dids
      } catch (error) {
        verbose && Logger.error(error)
        return []
      }
    },

    getPublishedSubscriptions: async (
      account: Account,
      searchOptions?: SearchOptions,
    ): Promise<QueryResult> => {
      try {
        const query = await sdk.search.subscriptionsCreated(
          account,
          searchOptions?.customNestedQueries,
          searchOptions?.offset,
          searchOptions?.page,
          searchOptions?.sort,
          searchOptions?.appId,
        )
        return query
      } catch (error) {
        verbose && Logger.error(error)
        return emptyQueryResult
      }
    },

    getPublishedSubscriptionsAndServices: async (
      account: Account,
      searchOptionsSubscriptions?: SearchOptions,
      searchOptionsServices?: SearchOptions,
    ): Promise<SubscriptionsAndServicesDDOs[]> => {
      try {
        const query = await sdk.search.subscriptionsCreated(
          account,
          searchOptionsSubscriptions?.customNestedQueries,
          searchOptionsSubscriptions?.offset,
          searchOptionsSubscriptions?.page,
          searchOptionsSubscriptions?.sort,
          searchOptionsSubscriptions?.appId,
        )
        return getSubscriptionsAndServices(query.results, sdk, searchOptionsServices)
      } catch (error) {
        verbose && Logger.error(error)
        return []
      }
    },

    getPublishedSubscriptionsAndDatasets: async (
      account: Account,
      searchOptionsSubscriptions?: SearchOptions,
      searchOptionsDatasets?: SearchOptions,
    ): Promise<SubscriptionsAndDatasetsDDOs[]> => {
      try {
        const query = await sdk.search.subscriptionsCreated(
          account,
          searchOptionsSubscriptions?.customNestedQueries,
          searchOptionsSubscriptions?.offset,
          searchOptionsSubscriptions?.page,
          searchOptionsSubscriptions?.sort,
          searchOptionsSubscriptions?.appId,
        )
        return getSubscriptionsAndDatasets(query.results, sdk, searchOptionsDatasets)
      } catch (error) {
        verbose && Logger.error(error)
        return []
      }
    },

    getPurchasedSubscriptions: async (
      account: Account,
      searchOptions?: SearchOptions,
    ): Promise<QueryResult> => {
      try {
        const query = await sdk.search.subscriptionsPurchased(
          account,
          searchOptions?.customNestedQueries,
          searchOptions?.offset,
          searchOptions?.page,
          searchOptions?.sort,
          searchOptions?.appId,
        )
        return query
      } catch (error) {
        verbose && Logger.error(error)
        return emptyQueryResult
      }
    },

    getPurchasedSubscriptionsAndServices: async (
      account: Account,
      searchOptionsSubscriptions?: SearchOptions,
      searchOptionsServices?: SearchOptions,
    ): Promise<SubscriptionsAndServicesDDOs[]> => {
      try {
        const query = await sdk.search.subscriptionsPurchased(
          account,
          searchOptionsSubscriptions?.customNestedQueries,
          searchOptionsSubscriptions?.offset,
          searchOptionsSubscriptions?.page,
          searchOptionsSubscriptions?.sort,
          searchOptionsSubscriptions?.appId,
        )
        return getSubscriptionsAndServices(query.results, sdk, searchOptionsServices)
      } catch (error) {
        verbose && Logger.error(error)
        return []
      }
    },

    getPurchasedSubscriptionsAndDatasets: async (
      account: Account,
      searchOptionsSubscriptions?: SearchOptions,
      searchOptionsDatasets?: SearchOptions,
    ): Promise<SubscriptionsAndDatasetsDDOs[]> => {
      try {
        const query = await sdk.search.subscriptionsPurchased(
          account,
          searchOptionsSubscriptions?.customNestedQueries,
          searchOptionsSubscriptions?.offset,
          searchOptionsSubscriptions?.page,
          searchOptionsSubscriptions?.sort,
          searchOptionsSubscriptions?.appId,
        )
        return getSubscriptionsAndDatasets(query.results, sdk, searchOptionsDatasets)
      } catch (error) {
        verbose && Logger.error(error)
        return []
      }
    },

    getAssociatedServices: async (
      did: string,
      searchOptions?: SearchOptions,
    ): Promise<QueryResult> => {
      try {
        const query = await sdk.search.servicesBySubscription(
          did,
          searchOptions?.customNestedQueries,
          searchOptions?.offset,
          searchOptions?.page,
          searchOptions?.sort,
          searchOptions?.appId,
        )
        return query
      } catch (error) {
        verbose && Logger.error(error)
        return emptyQueryResult
      }
    },

    getAssociatedDatasets: async (
      did: string,
      searchOptions?: SearchOptions,
    ): Promise<QueryResult> => {
      try {
        const query = await sdk.search.datasetsBySubscription(
          did,
          searchOptions?.customNestedQueries,
          searchOptions?.offset,
          searchOptions?.page,
          searchOptions?.sort,
          searchOptions?.appId,
        )
        return query
      } catch (error) {
        verbose && Logger.error(error)
        return emptyQueryResult
      }
    },

    isAssetHolder: async (did: string, walletAddress: string): Promise<boolean> => {
      const purchased = await loadFulfilledEvents(sdk, walletAddress, 'accessCondition')

      const purchasedDDO = await Promise.all(
        purchased.map((asset) => sdk.assets.resolve(asset.documentId)),
      )

      const asset = purchasedDDO.filter((p) => p).find((p) => p.id === did)
      return Boolean(asset)
    },

    isNFT1155Holder: async (did: string, walletAddress: string): Promise<boolean> => {
      const walletAccount = new Account(walletAddress)
      if (walletAccount) {
        const balance = await sdk.nfts1155.balance(did, walletAccount)
        const nftBalance = BigNumber.from(balance).toNumber()
        return nftBalance > 0
      }
      return false
    },

    isNFT721Holder: async (nftAddress: string, walletAddress: string): Promise<boolean> => {
      if (walletAddress) {
        const walletAccount = new Account(walletAddress)
        const nft721 = await sdk.contracts.loadNft721(nftAddress)
        const balance = await nft721.balanceOf(walletAccount)
        return balance.gt(0)
      }

      return false
    },
  }

  const assets: AssetsModule = {
    findOne: async (did: string): Promise<DDO> => {
      try {
        if (isEmptyObject(sdk)) return {} as DDO
        const ddo: DDO = await sdk.assets.resolve(String(did))
        return ddo
      } catch (error) {
        verbose && Logger.error(error)
        return {} as DDO
      }
    },

    query: async (q: SearchQuery): Promise<QueryResult> => {
      try {
        if (isEmptyObject(sdk)) return {} as QueryResult
        const queryResponse: QueryResult = await sdk?.services.metadata.queryMetadata(q)
        return queryResponse
      } catch (error) {
        verbose && Logger.error(error)
        return {} as QueryResult
      }
    },

    transfer: async ({
      did,
      amount,
      ercType,
      newOwner,
    }: {
      did: string
      amount: number
      ercType?: ERCType
      newOwner: Account
    }): Promise<boolean> => {
      try {
        if (!config.neverminedNodeAddress || !config.neverminedNodeUri) {
          Logger.log('neverminedNodeAddress or neverminedNodeUri is not set. Abort.')
          return false
        }
        const transferEndpoint = `${config.neverminedNodeUri}/api/v1/node/services/nft-transfer`
        if (!newOwner) {
          Logger.log('Users need to be connected to perform a transfer. abort.')
          return false
        }
        const ddo: DDO = await sdk.assets.resolve(String(did))
        const currentOwner = await sdk.assets.owner(ddo.id) // Get current owner
        const agreementId = await conductOrder({
          sdk,
          ddo,
          neverminedNodeAddress: config.neverminedNodeAddress,
          newOwner,
          ercType,
        })

        if (!agreementId) {
          Logger.log('Could not approve spending from new owner wallet. abort.')
          return false
        }
        Logger.log(`Obtained agreement ID ${agreementId}`)
        const isTransferSuccessful = await sdk.utils.fetch.post(
          transferEndpoint,
          JSON.stringify({
            agreementId,
            nftAmount: amount,
            nftHolder: new Account(currentOwner).getId(),
            nftReceiver: newOwner.getId(),
          }),
        )

        if (isTransferSuccessful) {
          Logger.log(`Transferred ${amount} NFT with did ${ddo.id} to ${newOwner.getId()}`)
          return true
        }

        Logger.log('Something went wrong! Please try again.')
        return false
      } catch (e) {
        Logger.error(e)
        return false
      }
    },

    orderAsset: async (did: string, consumerAccount: Account): Promise<string> => {
      const owner = await sdk.assets.owner(did)

      if (owner === consumerAccount.getId()) {
        throw new ClientError(
          "You are already the owner, you don't need to order the asset",
          'Catalog',
        )
      }

      const purchased = await loadFulfilledEvents(sdk, consumerAccount.getId(), 'accessCondition')

      const purchasedDDO = await Promise.all(
        purchased.map((asset) => sdk.assets.resolve(asset.documentId)),
      )

      const asset = purchasedDDO.filter((p) => p).find((p) => p.id === did)

      if (asset) {
        return getAgreementId(sdk, 'accessTemplate', did)
      }

      return sdk.assets.order(did, consumerAccount)
    },

    orderNFT1155: async (did: string, amount: BigNumber, consumer: Account): Promise<string> => {
      const balance = await sdk.nfts1155.balance(did, consumer)

      if (BigNumber.from(balance).toNumber() > 0) {
        return getAgreementId(sdk, 'nftAccessTemplate', did)
      }

      return sdk.nfts1155.order(did, amount, consumer)
    },

    orderNFT721: async (did: string, consumer: Account): Promise<string> => {
      const holder = await sdk.nfts721.ownerOf(did)

      if (holder === consumer.getId()) {
        return getAgreementId(sdk, 'nft721AccessTemplate', did)
      }

      return sdk.nfts721.order(did, consumer)
    },

    nftDetails: async (did: string, ercType: ERCType): Promise<NFTDetails> => {
      try {
        if (isEmptyObject(sdk)) return {} as NFTDetails
        return ercType === 721 ? sdk.nfts721.details(did) : sdk.nfts1155.details(did)
      } catch (error) {
        verbose && Logger.error(error)
        return {} as NFTDetails
      }
    },

    downloadNFT: async ({
      did,
      ercType,
      password,
      path,
      fileIndex,
      consumer,
    }: {
      did: string
      ercType?: ERCType
      path?: string
      fileIndex?: number
      password?: string
      consumer: Account
    }): Promise<boolean> => {
      try {
        if (password) {
          const cryptoConfig = await _getCryptoConfig(sdk, password)
          const dtp = await _getDTPInstance(sdk, config, cryptoConfig)
          const consumerDtp = (await _grantAccess({
            did,
            account: consumer,
            password,
            sdk,
            dtp,
          })) as Account

          const response = await sdk.assets.download(
            did,
            consumerDtp,
            path,
            fileIndex,
            'nft-sales-proof',
          )

          return Boolean(response)
        }

        return ercType === 721
          ? (sdk.nfts721.access(did, consumer, path, fileIndex) as Promise<boolean>)
          : (sdk.nfts1155.access(did, consumer, path, fileIndex) as Promise<boolean>)
      } catch (error) {
        verbose && Logger.error(error)
        return false
      }
    },

    downloadAsset: async ({
      did,
      fileIndex,
      path,
      password,
      consumer,
    }: {
      did: string
      fileIndex?: number
      path?: string
      password?: string
      consumer: Account
    }): Promise<boolean> => {
      try {
        const agreementId = await getAgreementId(sdk, 'accessTemplate', did)

        if (password && agreementId) {
          const cryptoConfig = await _getCryptoConfig(sdk, password)
          const dtp = await _getDTPInstance(sdk, config, cryptoConfig)

          const consumerDtp = (await _grantAccess({
            did,
            account: consumer,
            password,
            sdk,
            dtp,
          })) as Account

          const response = await sdk.assets.download(
            did,
            consumerDtp,
            path,
            fileIndex,
            'nft-sales-proof',
          )

          return Boolean(response)
        }

        if ((await sdk.assets.owner(did)) === consumer.getId()) {
          const response = await sdk.assets.download(did, consumer, path, fileIndex)
          return Boolean(response)
        }

        return sdk.assets.access(agreementId, did, consumer, path, fileIndex) as Promise<boolean>
      } catch (error) {
        verbose && Logger.error(error)
        return false
      }
    },

    getCustomErc20Token: async (customErc20TokenAddress: string, address: string) => {
      const customErc20Token = await sdk.contracts.loadErc20(customErc20TokenAddress)

      return {
        name: await customErc20Token.name(),
        symbol: await customErc20Token.symbol(),
        decimals: await customErc20Token.decimals(),
        balance: await customErc20Token.balanceOf(address),
      }
    },

    uploadAssetToFilecoin: async (file: File, filecoinUrl: string) => {
      const form = new FormData()
      form.append('file', file)

      const nodeUploadUrl = `${config.neverminedNodeUri}${filecoinUrl}`

      const response = await handlePostRequest(nodeUploadUrl, form)

      return response.url
    },
  }

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
            _receivers: true,
          },
        }
        return sdk.keeper.conditions.lockPaymentCondition.events.subscribe(cb, config)
      } catch (error) {
        verbose && Logger.error(error)
        return {} as ContractEventSubscription
      }
    },

    transferEvents: (
      cb: (events: EventResult[]) => void,
      ercType: ERCType = 1155,
    ): ContractEventSubscription => {
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
            _receiver: true,
          },
        }
        return sdk.keeper.conditions[
          ercType === 721 ? TransferNFTConditionMethod.nft721 : TransferNFTConditionMethod.nft1155
        ].events.subscribe(cb, config)
      } catch (error) {
        verbose && Logger.error(error)
        return {} as ContractEventSubscription
      }
    },
  }

  const nfts = {
    access: async ({
      did,
      nftHolder,
      nftAmount,
      chainId,
      messageAuth,
      ercType,
      password,
      onEvent,
      buyer,
    }: {
      did: string
      nftHolder: string
      nftAmount: BigNumber
      chainId: number
      messageAuth?: string
      ercType?: ERCType
      password?: string
      buyer: Account
      onEvent?: (next: OrderProgressStep) => void
    }): Promise<string> => {
      let agreementId = ''
      let transferResult

      try {
        if (!account.isTokenValid(buyer.getId(), chainId)) {
          Logger.error('Your login is expired or not valid')
          await account.generateToken({ address: buyer.getId(), chainId, message: messageAuth })
        }

        if (password) {
          const cryptoConfig = await _getCryptoConfig(sdk, password)
          const dtp = await _getDTPInstance(sdk, config, cryptoConfig)

          const consumer = (await _grantAccess({
            did,
            account: buyer,
            password,
            sdk,
            dtp,
          })) as Account

          agreementId = await dtp.order(did, nftAmount, consumer, nftHolder)

          transferResult = await dtp.transferForDelegate(
            did,
            agreementId,
            consumer,
            nftAmount,
            nftHolder,
          )
        } else {
          agreementId = await executeWithProgressEvent(
            () =>
              ercType === 721
                ? sdk.nfts721.order(did, buyer)
                : sdk.nfts1155.order(did, BigNumber.from(nftAmount), buyer),
            onEvent,
          )

          transferResult =
            ercType === 721
              ? await sdk.nfts721.claim(agreementId, nftHolder, buyer.getId(), did)
              : await sdk.nfts1155.claim(agreementId, nftHolder, buyer.getId(), nftAmount)

          if (!transferResult) {
            throw new Error(
              `Error claiming the NFT of the subscription with agreement ${agreementId}`,
            )
          }
        }
      } catch (error) {
        verbose && Logger.error(error)
        if (!agreementId) {
          throw new LockPaymentError((error as Error).message)
        }

        throw new TransferError(agreementId, (error as Error).message)
      }

      return agreementId
    },
  }

  const IState = {
    sdk,
    isLoadingSDK: isLoading,
    sdkError,
    subscribe,
    assets,
    account,
    updateSDK,
    nfts,
    config,
  }

  return <NeverminedContext.Provider value={IState}>{children}</NeverminedContext.Provider>
}

export const NeverminedContext = createContext({} as NeverminedProviderContext)

export const useNevermined = (): NeverminedProviderContext => {
  const contextValue = useContext(NeverminedContext)

  if (!contextValue) {
    throw new Error(
      'could not find Nevermined context value; please ensure the component is wrapped in a <NeverminedProvider>',
    )
  }

  return contextValue
}
