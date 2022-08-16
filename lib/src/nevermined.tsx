import {
  Account,
  Config,
  DDO,
  Logger,
  Nevermined,
  SearchQuery,
  ClientError,
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
  GenericOutput,
  MarketplaceAPIToken,
  MintNFTInput,
  NeverminedProviderContext,
  NeverminedProviderProps,
  NFTDetails,
  NftTypes,
  SubscribeModule,
} from './types';
import {
  conductOrder,
  getCurrentAccount,
  isEmptyObject,
  loadFullfilledEvents,
  getAgreementId,
  handlePostRequest
} from './utils';
import { isTokenValid, newMarketplaceApiToken } from './utils/marketplace_token';
import BigNumber from '@nevermined-io/nevermined-sdk-js/dist/node/utils/BigNumber';

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

/**
 * Nevermined Provider to get the core Catalog functionalities as context
 * 
 * @param config - The config needed to build Nevermined SDK
 * @param verbose - Show Catalog logs in console logs if it sets to `true`
 * 
 * @example
 * Initialize NeverminedProvider:
 * ```typescript
 * import React from 'react';
 * import ReactDOM from 'react-dom';
 * import Catalog from 'test-catalog-core';
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
 * ```
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

  /**
   * Rebuild Nevermined sdk with new config values
   * @param newConfig - Config object to rebuild Nevermined SDK
   * 
   * @example
   * Update Nevermined sdk again:
   * ```
   * const Example = (props: ExampleProps) => {
   *  const { updateSDK, isLoadingSDK } = Catalog.useNevermined();
   * 
   *  const reloadSdk = async() => {
   *     const config = {
   *         web3Provider: window.ethereum,
   *         nodeUri: network,
   *         marketplaceUri,
   *         gatewayUri,
   *         faucetUri,
   *         gatewayAddress,
   *         secretStoreUri,
   *         verbose,
   *         marketplaceAuthToken: Catalog.fetchMarketplaceApiTokenFromLocalStorage().token || '',
   *         artifactsFolder,
   *         graphHttpUri: graphUrl
   *     }
   *
   *     updateSDK(config)
   *   } 
   * } 
   * ```
   */
  const updateSDK = async (newConfig: Config): Promise<boolean> => {
    const newSDK = await initializeNevermined({ ...config, ...newConfig });
    if (newSDK.success) {
      dispatch({ type: 'SET_SDK', payload: { sdk: newSDK.data } });
    }
    return newSDK.success;
  };

  /**
   * `account` contain all the functionalities to handle authentications and
   * collections belonged to an account
   * 
   * @example
   * Authorization example:
   * ```
   * const Example = (props: ExampleProps) => {
   *  const { assets, account, isLoadingSDK } = Catalog.useNevermined();
   *  
   *  const buy = async () => {
   *    if (!account.isTokenValid()) {
   *      await account.generateToken();
   *    }
   *  
   *    (...)
   *  };
   * }
   * ```
   * 
   * Check NFT1155 holder example
   * ```
   * const Example = (props: ExampleProps) => {
   *  const { account, isLoadingSDK } = Catalog.useNevermined();
   *  const [ownNFT1155, setOwnNFT1155] = useState(false);
   *  
   *  useEffect(() => {
   *    (async () => {
   *      const response = await account.isNFT1155Holder(ddo.id, walletAddress);
   *      setOwnNFT1155(response);
   *    })()
   *  }, [walletAddress])
   *  
   * }
   * ```
   */
  const account: AccountModule = {
    /**
     * check if the token for Marketplace API is valid
     * @returns if token is valid it will return true
     */
    isTokenValid: (): boolean => isTokenValid(),
    /**
     * Generate a token for authentication in the Marketplace API
     * @returns The new generated token
     */
    generateToken: async (): Promise<MarketplaceAPIToken> => {
      const tokenData = await newMarketplaceApiToken(sdk);
      const { data } = await initializeNevermined({
        ...config,
        marketplaceAuthToken: tokenData.token
      });
      dispatch({ type: 'SET_SDK', payload: { sdk: data } });
      return tokenData;
    },
    /**
     * Get all the assets published from the address passed by argument
     * @param address The address owner of the assets that we want to get
     * @returns List of assets which was published by the address given
     */
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

    /**
     * Get the assets bought by the address given
     * @param address The address which bought the assets returned
     * @returns List of assets which was bought by the address given as argument
     */
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

    /**
     * This method validates if a user is a NFT (ERC-1155 based) holder for a specific `tokenId`.
     * For ERC-1155 tokens, we use the DID as tokenId. A user can between zero an multiple editions
     * of a NFT (limitted by the NFT cap).
     * 
     * @param did The unique identifier of the NFT within a NFT ERC-1155 contract
     * @param walletAddress The public address of the user
     * @returns true if the user owns at least one edition of the NFT
     */
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

    /**
     * This method validates if a user is a NFT (ERC-721 based) holder for a specific NFT contract address.
     * For ERC-1155 tokens, we use the DID as tokenId. A user can between zero an multiple editions
     * of a NFT (limitted by the NFT cap).
     * 
     * @param nftAddress The contract address of the ERC-721 NFT contract
     * @param walletAddress The public address of the user
     * @returns true if the user holds the NFT
     */
    isNFT721Holder: async (
      did: string,
      nftTokenAddress: string,
      walletAddress: string
    ): Promise<boolean> => {
      if (walletAddress) {
        const nftOwner = await sdk.nfts.ownerOf(did, nftTokenAddress);
        return nftOwner === walletAddress;
      }
      
      return false;
    },
  };

  /**
   * `assets` contain all the functionalities to handle assets for example get, 
   * mint, transfer, order or download asset asset
   */
  const assets: AssetsModule = {
    getSingle: async (did: string): Promise<DDO> => {
      try {
        if (isEmptyObject(sdk)) return {} as DDO;
        const ddo: DDO = await sdk.assets.resolve(String(did));
        return ddo;
      } catch (e) {
        verbose && Logger.error(error);
        return {} as DDO;
      }
    },

    /**
     * 
     * @param q Query to custom the search: order result, filtering, etc...
     * @returns List of assets according with the query given
     */
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

    /**
     * Mint an asset
     * @param input Object input with all the data required to mint an asset
     * @returns If the asset was minted successfuly the function will return `true`
     */
    mint: async (input: MintNFTInput): Promise<DDO | undefined> => {
      try {
        if (isEmptyObject(sdk)) return undefined;
        const [publisherAddress] = await sdk.accounts.list();
        if (!publisherAddress) {
          Logger.error('No account was found!');
          return;
        }

        if (!config.gatewayAddress) {
          Logger.error('Gateway address from config is required to mint NFT1155 asset');
          return
        }

        const transferNftCondition = sdk.keeper.conditions.transferNftCondition;

        const transferNftConditionContractReceipt = await sdk.nfts.setApprovalForAll(transferNftCondition.address, true, publisherAddress);

        Logger.log(`Contract Receipt for approved transfer NFT: ${transferNftConditionContractReceipt}`);

        const gateawayContractReceipt = await sdk.nfts.setApprovalForAll(config.gatewayAddress, true, publisherAddress);

        Logger.log(`Contract Receipt for approved gateway: ${gateawayContractReceipt}`);

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

    /**
     * Transfer the ownership of the asset to other account
     * @param assetInfo
     * @param assetInfo.did The id of the asset
     * @param assetInfo.amount The amount of asset to transfer 
     * @returns Return true if asset was transferred successfuly
     */
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

    orderAsset: async (did: string): Promise<string> => {
      const account = await getCurrentAccount(sdk);

      const owner = await sdk.assets.owner(did);

      if (owner === account.getId()) {
        throw new ClientError(
          "You are already the owner, you don't need to order the asset",
          'Catalog'
        );
      }

      const purchased = await loadFullfilledEvents(sdk, account.getId());

      const purchasedDDO = await Promise.all(
        purchased.map((asset) => sdk.assets.resolve(asset.documentId))
      );

      const asset = purchasedDDO.filter((p) => p).find((p) => p.id === did);

      if (asset) {
        return getAgreementId(sdk, 'accessTemplate', did, account.getId());
      }

      return sdk.assets.order(did, 'access', account);
    },

    orderNFT1155: async (did: string, amount = 1): Promise<string> => {
      const account = await getCurrentAccount(sdk);

      const balance = await sdk.nfts.balance(did, account);

      if (BigNumber.from(balance).toNumber() > 0) {
        return getAgreementId(sdk, 'nftAccessTemplate', did, account.getId());
      }

      return sdk.nfts.order(did, amount, account);
    },

    orderNFT721: async (did: string, nftTokenAddress: string): Promise<string> => {
      const account = await getCurrentAccount(sdk);

      const holder = await sdk.nfts.ownerOf(did, nftTokenAddress);

      if (holder === account.getId()) {
        return getAgreementId(sdk, 'nft721AccessTemplate', did, account.getId());
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

    downloadAsset: async (did: string, agreementId: string): Promise<boolean> => {
      try {
        const account = await getCurrentAccount(sdk);

        if ((await sdk.assets.owner(did)) === account.getId()) {
          return sdk.assets.download(did, account);
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

  const subscription = {
    buySubscription: async (subscriptionDid: string, buyer: Account, nftHolder: string, nftAmount: number, nftType: NftTypes): Promise<boolean> => {
      try {
        const agreementId = nftType === 721 ? await sdk.nfts.order721(subscriptionDid, buyer): await sdk.nfts.order(subscriptionDid, nftAmount, buyer);
        return sdk.nfts.transferForDelegate(
          agreementId,
          nftHolder,
          buyer.getId(),
          nftAmount,
          nftType
        )

      } catch (error) {
        verbose && Logger.error(error);
        return false;
      }
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

export const useNevermined = (): NeverminedProviderContext => useContext(NeverminedContext);
