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
   * `account` contains all the functionalities to handle authentications and
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
   * `assets` contains all the functionalities to handle assets for example get, 
   * mint, transfer, order or download asset asset
   * 
   * @example
   * Mint an asset example:
   * 
   * ```
   * const Example = () => {
   *  const { isLoadingSDK, sdk, account, assets } = Catalog.useNevermined();
   *  const [ddo, setDDO] = useState<DDO>({} as DDO)
   *  
   *  const metadata: MetaData = {
   *    main: {
   *      name: '',
   *      files: [{
   *        index: 0,
   *        contentType: 'application/json',
   *        url: 'https://github.com/nevermined-io/docs/blob/master/docs/architecture/specs/metadata/examples/ddo-example.json'
   *      }],
   *      type: 'dataset',
   *      author: '',
   *      license: '',
   *      dateCreated: new Date().toISOString(),
   *      price: ''
   *    }
   *  };
   *  
   *  const constructRewardMap = (
   *    recipientsData: any[],
   *    priceWithoutFee: number,
   *    ownerWalletAddress: string
   *  ): Map<string, BigNumber> => {
   *    const rewardMap: Map<string, BigNumber> = new Map();
   *    let recipients: any = [];
   *    if (recipientsData.length === 1 && recipientsData[0].split === 0) {
   *      recipients = [
   *        {
   *          name: ownerWalletAddress,
   *          split: 100,
   *          walletAddress: ownerWalletAddress
   *        }
   *      ];
   *    }
   *    let totalWithoutUser = 0;
   *  
   *    recipients.forEach((recipient: any) => {
   *      if (recipient.split && recipient.split > 0) {
   *        const ownSplit = ((priceWithoutFee * recipient.split) / 100).toFixed();
   *        rewardMap.set(recipient.walletAddress, BigNumber.from(+ownSplit));
   *        totalWithoutUser += recipient.split;
   *      }
   *    });
   *  
   *    if (!rewardMap.has(ownerWalletAddress)) {
   *      const ownSplitReinforced = +((priceWithoutFee * (100 - totalWithoutUser)) / 100).toFixed();
   *      rewardMap.set(ownerWalletAddress, BigNumber.from(ownSplitReinforced));
   *    }
   *  
   *    return rewardMap;
   *  };
   *  
   *  const mint = async () => {
   *    try {
   *      const publisher = await getCurrentAccount(sdk);
   *      const rewardsRecipients: any[] = [];
   *      const assetRewardsMap = constructRewardMap(rewardsRecipients, 100, publisher.getId());
   *      const assetRewards = new AssetRewards(assetRewardsMap);
   *      const data: MintNFTInput = {
   *        metadata,
   *        publisher,
   *        cap: 100,
   *        royalties: 0,
   *        nftAmount: 1,
   *        preMint: true,
   *        erc20TokenAddress: '0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e', //usdc token
   *        //@ts-ignore
   *        assetRewards
   *      };
   *      if (!account.isTokenValid()) {
   *        await account.generateToken();
   *      }
   *      const response = await assets.mint(data);
   *      setDDO(response);
   *    } catch (error) {
   *      console.log('error', error);
   *    }
   *  };
   *  
   *  return (
   *    <>
   *      ...     
   *    </>
   *  );
   * };  
   * ```
   * 
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
     * @returns If the asset was minted successfully the function will return `true`
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
     * @returns Return true if asset was transferred successfully
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

    /**
     * Get the entire object of the asset
     * @param did id of the asset
     * @returns Asset object
     */
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

    /**
     * This method order a asset to allow after transfer to the buyer (the method only order but not transfer)
     * @param did id of the asset
     * @returns In case the order is completed successfully it returns the agreementId
     * which is needed to transfer the asset to the buyer
     */
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

    /**
     * This method order a NFT1155 asset to allow after transfer to the buyer (the method only order but not transfer)
     * @param did id of the NFT1155 asset
     * @param amount Amount of NFT1155 assets to order
     * @returns In case the order is completed successfully it returns the agreementId
     * which is needed to transfer the NFT1155 asset to the buyer
     */
    orderNFT1155: async (did: string, amount = 1): Promise<string> => {
      const account = await getCurrentAccount(sdk);

      const balance = await sdk.nfts.balance(did, account);

      if (BigNumber.from(balance).toNumber() > 0) {
        return getAgreementId(sdk, 'nftAccessTemplate', did, account.getId());
      }

      return sdk.nfts.order(did, amount, account);
    },

    /**
     * This method order a NFT721 asset to allow after transfer to the buyer (the method only order but not transfer)
     * @param did id of the NFT721 asset
     * @param amount Amount of NFT721 assets to order
     * @returns In case the order is completed successfully it returns the agreementId
     * which is needed to transfer the NFT721 asset to the buyer
     */
    orderNFT721: async (did: string, nftTokenAddress: string): Promise<string> => {
      const account = await getCurrentAccount(sdk);

      const holder = await sdk.nfts.ownerOf(did, nftTokenAddress);

      if (holder === account.getId()) {
        return getAgreementId(sdk, 'nft721AccessTemplate', did, account.getId());
      }

      return sdk.nfts.order721(did, account);
    },

    /**
     * Get the aggreement details of the NFT asset (owner, nfts supplay, royalties, etc...)
     * @param did id of the NFT (721 & 1155) asset
     * @returns Agreement details of the NFT asset
     */
    nftDetails: async (did: string): Promise<NFTDetails> => {
      try {
        if (isEmptyObject(sdk)) return {} as NFTDetails;
        return sdk.nfts.details(did);
      } catch (error) {
        verbose && Logger.error(error);
        return {} as NFTDetails;
      }
    },

    /**
     * Download a NFT asset already ordered and transfered to the buyer,
     * if the user is the owner of the asset
     * @param did id of the NFT (721 & 1155) asset
     * @returns if the NFT is downloaded successfully the method will return a true
     */
    downloadNFT: async (did: string): Promise<boolean> => {
      try {
        const account = await getCurrentAccount(sdk);

        return sdk.nfts.access(did, account);
      } catch (error) {
        verbose && Logger.error(error);
        return false;
      }
    },

    /**
     * Download an asset already ordered and transfered to the buyer,
     * if the user is the owner of the asset
     * @param did id of the NFT (721 & 1155) asset
     * @returns if the NFT is downloaded successfully the method will return a true
     */
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

    /**
     * Get all the details about a custom erc20 token
     * @param customErc20TokenAddress The custom token address
     * @returns Custom token details
     */
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

    /**
     * Upload files to Filecoin
     * @param file The file to upload to Filecoin
     * @param filecoinUrl The url of the Filecoin server
     * @returns The url where is located the file already uploaded
     */
    uploadAssetToFilecoin: async (file: File, filecoinUrl: string) => {
      const form = new FormData();
      form.append('file', file);

      const gatewayUploadUrl = `${config.gatewayUri}${filecoinUrl}`;

      const response = await handlePostRequest(gatewayUploadUrl, form);

      return response.url;
    }
  };

  /**
   * `subscribe` contains all the functionalities to handle events
   * 
   * @example
   * Subcribe payment event:
   * 
   * ```
   * const Example = () => {
   *  const { subscribe, subscription, account, isLoadingSDK} = Catalog.useNevermined();
   *  const { paymentEvent, setPaymentEvent } = useState<ContractEventSubscription>();
   * 
   *  const buy = async () => {
   *   if (!account.isTokenValid()) {
   *     await account.generateToken();
   *   }
   *
   *   const currentAccount = await getCurrentAccount(sdk);
   *   const response = await subscription.buySubscription(ddo.id, currentAccount, owner, 1, 1155);
   *  };
   * 
   *  const stopLog = () => {
   *    paymentEvent.unsuscribe();
   *  }
   * 
   *  useEffect(() => {
   *    if(isLoadingSDK) {
   *     return;
   *    }
   *    (async () => {
   *      setPaymentEvent(subscribe.paymentEvents((events)=> {
   *        Logger.log(events)
   *      }))
   *    })()
   *  }, [isLoadingSDK])
   *  
   *  return (
   *    <div>
   *        <button onClick={buy} disabled={isLoadingSDK}>
   *          buy
   *        </button>
   *        <button onClick={stopLog} disabled={isLoadingSDK}>
   *          Stop the logs
   *        </button>
   *    </div>
   *  );
   * }
   * ```
   */
  const subscribe: SubscribeModule = {
    /**
     * Subscribe a `payment` event and execute callbacks once that this event is listened
     * @param cb Callback event
     * @returns return the `payment` event with a functionality to unsubscribe 
     */
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

    /**
     * Subscribe a `transfer` event and execute callbacks once that this event is listened
     * @param cb Callback to execute
     * @returns return the `transfer` event with a functionality to unsubscribe 
     */
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

  /**
   * `subscription` contains all the functionalities to handle asset subscritions by payment
   * 
   * @example
   * Buy subscription example
   * 
   * ```
   * 
   * const BuyAsset = ({ddo}: {ddo: DDO}) => {
   *  const { assets, account, isLoadingSDK, subscription, sdk } = Catalog.useNevermined();
   *  const { walletAddress } = MetaMask.useWallet();
   *  const [ownNFT1155, setOwnNFT1155] = useState(false);
   *  const [isBought, setIsBought] = useState(false);
   *  const [owner, setOwner] = useState('');
   *  
   *  useEffect(() => {
   *    (async () => {
   *      setOwnNFT1155(await account.isNFT1155Holder(ddo.id, walletAddress));
   *      setOwner(await sdk.assets.owner(ddo.id))
   *    })()
   *  }, [walletAddress, isBought])
   *  
   *  const buy = async () => {
   *    if (!account.isTokenValid()) {
   *      await account.generateToken();
   *    }
   *  
   *    const currentAccount = await getCurrentAccount(sdk);
   *    const response = await subscription.buySubscription(ddo.id, currentAccount, owner, 1, 1155);
   *    setIsBought(response);
   *  };
   *  
   *  const download = async () => {
   *    await assets.downloadNFT(ddo.id);
   *  };
   *  
   *  return (
   *    <div>
   *      {ownNFT1155 ? (
   *        <button onClick={download} disabled={isLoadingSDK}>
   *          Download NFT
   *        </button>
   *      ) : (
   *        owner !== walletAddress ?
   *        <button onClick={buy} disabled={isLoadingSDK}>
   *          buy
   *        </button>
   *        : <span>The owner cannot buy, please change the account to buy the NFT asset</span>
   *      )}
   *    </div>
   *  );
   * }
   * ```
   */
  

  const subscription = {

  
    /**
     * Order a NFT asset and transfer and delegate it to the subscription buyer
     * @param subscriptionDid Id of the NFT to subscribe
     * @param buyer The account who buy the subscription of the NFT asset
     * @param nftHolder The owner of the NFT asset
     * @param nftAmount The amount of NFT asset to buy
     * @param nftType NFT asset type which can be 721 or 1155
     * @returns string that contains the id of the agreement
     * @throws Error when there is an exception ordering the nft or the transferForDelegate method returns false
     */
    buySubscription: async (subscriptionDid: string, buyer: Account, nftHolder: string, nftAmount: number, nftType: NftTypes): Promise<string> => {
      
      let agreementId = ''
      let transferResult = false
      try {
        agreementId = nftType === 721 ? await sdk.nfts.order721(subscriptionDid, buyer): await sdk.nfts.order(subscriptionDid, nftAmount, buyer);
        transferResult = await sdk.nfts.transferForDelegate(
          agreementId,
          nftHolder,
          buyer.getId(),
          nftAmount,
          nftType
        )
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

export const useNevermined = (): NeverminedProviderContext => useContext(NeverminedContext);
