import {
  Account,
  Config,
  DDO,
  MetaData,
  Nevermined,
  SearchQuery
} from '@nevermined-io/nevermined-sdk-js';
import {
  ContractEventSubscription,
  EventResult
} from '@nevermined-io/nevermined-sdk-js/dist/node/events';
import { NftTypes } from '@nevermined-io/nevermined-sdk-js/dist/node/gateway/Gateway';
import { TxParameters } from '@nevermined-io/nevermined-sdk-js/dist/node/keeper/contracts/ContractBase';
import { QueryResult } from '@nevermined-io/nevermined-sdk-js/dist/node/metadata/Metadata';
import AssetRewards from '@nevermined-io/nevermined-sdk-js/dist/node/models/AssetRewards';
import { BigNumber } from 'ethers';


export { RoyaltyKind } from '@nevermined-io/nevermined-sdk-js/dist/node/nevermined/Assets';
export type {
  ContractEventSubscription,
  EventResult
} from '@nevermined-io/nevermined-sdk-js/dist/node/events';
export { zeroX } from '@nevermined-io/nevermined-sdk-js/dist/node/utils';


/**
 * Values returns from the main NVM context
 * Can be consumed after wrapping your project with the catalog(see setup steps)
 * 
 * example:
 *
 * option 1: const { sdk, sdkError, isLoadingSdk, ...others } = useContext(Catalog.NeverminedContext)
 * option 2: const { sdk, sdkError, isLoadingSdk, ...others } = Catalog.useNevermined()
 */
export interface NeverminedProviderContext {
  /** Nevermined sdk instance which has all the core functionalities */
  sdk: Nevermined;
  /** Error message from sdk */
  sdkError: any;
  /** True if sdk is loading */
  isLoadingSDK: boolean;
  /**
   * Rebuild Nevermined sdk with new config values
   * @param newConfig - Config object to rebuild Nevermined SDK
   * 
   * @example
   * Update Nevermined sdk again:
   * ```ts
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
  updateSDK: (newConfig: Config) => Promise<boolean>;
  /**
   * `subscribe` contains all the functionalities to handle events
   * 
   * @example
   * Subcribe payment event:
   * 
   * ```ts
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
  subscribe: SubscribeModule;
  /**
   * `assets` contains all the functionalities to handle assets for example get, 
   * mint, transfer, order or download asset asset
   * 
   * @example
   * Mint an asset example:
   * 
   * ```ts
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
  assets: AssetsModule;
  /**
   * `account` contains all the functionalities to handle authentications and
   * collections belonged to an account
   * 
   * @example
   * Authorization example:
   * ```ts
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
   * ```ts
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
  account: AccountModule;
  /**
   * `subscription` contains all the functionalities to handle asset subscritions by payment
   * 
   * @example
   * Buy subscription example
   * 
   * ```ts
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
  subscription: SubscriptionActions;
}

/**
 * Nevermined Provider to get the core Catalog functionalities as context
 * 
 * @param config - The config needed to build Nevermined SDK
 * @param verbose - Show Catalog logs in console logs if it sets to `true`
 * 
 * @example
 * Initialize NeverminedProvider:
 * ```ts
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
 * 
 */
export interface NeverminedProviderProps {
  children: any;
  verbose?: boolean;
  config: Config;
}

/**
 * Used as a result data schema of a resolved promise
 */
export interface GenericOutput<T, E> {
  /** Data from the promise */
  data: T;
  /** If the promise throw an error */
  error: E;
  /** If the promise resolve was success */
  success: boolean;
}

/** Id of the asset */
export type DID = string;

/**
 * Details of the NFT asset agreement
 */
export interface NFTDetails {
  /** The owner of the asset */
  owner: string;
  /** The last checksum generated to verify the sources */
  lastChecksum: string;
  /** Url where is located the asset */
  url: string;
  /** The modification of the asset */
  lastUpdatedBy: string;
  /** The block number from blockchain where the asset was updated */
  blockNumberUpdated: number;
  /** Which services provide the asset */
  providers: any;
  /** The amount of ntfs that are in circulation */
  nftSupply: number
  /** The amount limit of nft which can be minted */
  mintCap: number;
  /** The rewards that the owner can get for every sale */
  royalties: number;
}

export enum State {
  Disabled = 'disabled',
  Unconfirmed = 'unconfirmed',
  Confirmed = 'confirmed'
}

/** User profile parameters based of the user profile entity */
export interface UserProfileParams {
  /** Id of the user */
  userId: string;
  /** The user can be shown */
  isListed: boolean;
  /** The state of the user account */
  state: State;
  /** The nickname of the user */
  nickname: string;
  /** The real name of the user */
  name: string;
  /** The email of the user */
  email: string;
  /** When the user was created */
  creationDate: string;
  /** When was the last user profile updated*/
  updateDate: string;
  /** Additional information of the user like picture, profesional profire, etc... */
  additionalInformation: unknown;
}

/** Custom token detail */
export interface CustomErc20Token {
  /** The nick of the token
   * @example
   * Ethereum -> ETH
   */
  symbol: string;
  /** Name of the token */
  name: string;
  /** Amount of tokens holded by the wallet account */
  balance: BigNumber;
  /** Decimals of the token */
  decimals: number;
}

/**
 * AccountModule is exposed by the main context
 * under 'account' object
 */
export interface AccountModule {
  /**
   * Get all the assets published from the address passed by argument
   * @param address The address owner of the assets that we want to get
   * @returns List of assets which was published by the address given
   */
  getReleases: (address: string) => Promise<DID[]>;
  /**
   * Get the assets bought by the address given
   * @param address The address which bought the assets returned
   * @returns List of assets which was bought by the address given as argument
   */
  getCollection: (address: string) => Promise<DID[]>;
  /**
   * Generate a token for authentication in the Marketplace API
   * @returns The new generated token
   */
  generateToken: () => Promise<MarketplaceAPIToken>;
  /**
   * check if the token for Marketplace API is valid
   * @returns if token is valid it will return true
   */
  isTokenValid: () => boolean;
  /**
   * This method validates if a user is a NFT (ERC-1155 based) holder for a specific `tokenId`.
   * For ERC-1155 tokens, we use the DID as tokenId. A user can between zero an multiple editions
   * of a NFT (limitted by the NFT cap).
   * 
   * @param did The unique identifier of the NFT within a NFT ERC-1155 contract
   * @param walletAddress The public address of the user
   * @returns true if the user owns at least one edition of the NFT
  */
  isNFT1155Holder: (did: string, walletAddress: string) => Promise<boolean>;
  /**
   * This method validates if a user is a NFT (ERC-721 based) holder for a specific NFT contract address.
   * For ERC-721 tokens, we use the DID as tokenId. A user can between zero an multiple editions
   * of a NFT (limitted by the NFT cap).
   * 
   * @param nftAddress The contract address of the ERC-721 NFT contract
   * @param walletAddress The public address of the user
   * @returns true if the user holds the NFT
   */
  isNFT721Holder: (did: string, nftTokenAddress: string, walletAddress: string) => Promise<boolean>;
}

/**
 * AssetsModule is exposed by the main context
 * under 'assets' object
 */
export interface AssetsModule {
  /**
   * Get the asset object by the did given
   * @param did id of the asset
   */
  getSingle: (did: DID) => Promise<DDO>;
  /**
   * 
   * @param q Query to custom the search: order result, filtering, etc...
   * @returns List of assets according with the query given
   */
  query: (q: SearchQuery) => Promise<QueryResult>;
  /**
   * Get the entire object of the asset
   * @param did id of the asset
   * @returns Asset object
   */
  resolve: (did: DID) => Promise<DDO | undefined>;
  /**
   * Transfer the ownership of the asset to other account
   * @param assetInfo
   * @param assetInfo.did The id of the asset
   * @param assetInfo.amount The amount of asset to transfer 
   * @returns Return true if asset was transferred successfully
   */
  transfer: ({ did, amount }: { did: string; amount: number }) => Promise<boolean>;
  /**
   * Mint an asset
   * @param input Object input with all the data required to mint an asset
   * @returns If the asset was minted successfully the function will return `true`
   */
  mint: (did: any) => Promise<any>;
  /**
   * Get the aggreement details of the NFT asset (owner, nfts supplay, royalties, etc...)
   * @param did id of the NFT (721 & 1155) asset
   * @returns Agreement details of the NFT asset
   */
  nftDetails: (did: string) => Promise<NFTDetails>;
  /**
   * This method order a asset to allow after transfer to the buyer (the method only order but not transfer)
   * @param did id of the asset
   * @returns In case the order is completed successfully it returns the agreementId
   * which is needed to transfer the asset to the buyer
   */
  orderAsset: (did: string) => Promise<string>;
  /**
   * This method order a NFT721 asset to allow after transfer to the buyer (the method only order but not transfer)
   * @param did id of the NFT721 asset
   * @param amount Amount of NFT721 assets to order
   * @returns In case the order is completed successfully it returns the agreementId
   * which is needed to transfer the NFT721 asset to the buyer
   */
  orderNFT721: (did: string, nftTokenAddress: string) => Promise<string>;
  /**
   * This method order a NFT1155 asset to allow after transfer to the buyer (the method only order but not transfer)
   * @param did id of the NFT1155 asset
   * @param amount Amount of NFT1155 assets to order
   * @returns In case the order is completed successfully it returns the agreementId
   * which is needed to transfer the NFT1155 asset to the buyer
   */
  orderNFT1155: (did: string) => Promise<string>;
  /**
   * Download a NFT asset already ordered and transfered to the buyer,
   * if the user is the owner of the asset
   * @param did id of the NFT (721 & 1155) asset
   * @returns if the NFT is downloaded successfully the method will return a true
   */
  downloadNFT: (did: string) => Promise<boolean>;
  /**
   * Get all the details about a custom erc20 token
   * @param customErc20TokenAddress The custom token address
   * @returns Custom token details
   */
  getCustomErc20Token: (customErc20TokenAddress: string) => Promise<CustomErc20Token>;
  /**
   * Download an asset already ordered and transfered to the buyer,
   * if the user is the owner of the asset
   * @param did id of the NFT (721 & 1155) asset
   * @returns if the NFT is downloaded successfully the method will return a true
  */
  downloadAsset: (did: string, agreementId: string) => Promise<boolean>;
  /**
   * Upload files to Filecoin
   * @param file The file to upload to Filecoin
   * @param filecoinUrl The url of the Filecoin server
   * @returns The url where is located the file already uploaded
   */
  uploadAssetToFilecoin: (File: File, filecoinUrl: string) => Promise<string>;
}

/**
 * `subscribe` contains all the functionalities to handle events
 * 
 * @example
 * Subcribe payment event:
 * 
 * ```ts
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
export interface SubscribeModule {
  /**
   * Subscribe a `payment` event and execute callbacks once that this event is listened
   * @param cb Callback event
   * @returns return the `payment` event with a functionality to unsubscribe 
   */
  paymentEvents: (cb: (events: EventResult[]) => void) => ContractEventSubscription;
  /**
   * Subscribe a `transfer` event and execute callbacks once that this event is listened
   * @param cb Callback to execute
   * @returns return the `transfer` event with a functionality to unsubscribe 
   */
  transferEvents: (cb: (events: EventResult[]) => void) => ContractEventSubscription;
}


/**
 * Response from "useAsset"
 */
export interface AssetState {
  /** Asset object */
  ddo: DDO;
  /** Metada of the asset with the basic information */
  metadata: MetaData;
  /** Error message from some operation with asset */
  error: string;
  /** True if asset object is loaded */
  isLoading: boolean;
  /** Details of the asset agreement */
  nftDetails: NFTDetails;
}

/**
 * Mint NFT input interface
 */
export interface MintNFTInput {
  /**MetaData object which contain all the parameters that describes the asset */
  metadata: MetaData;
  /**The Publisher account of the asset */
  publisher: Account;
  /** The maximum of assets that can be minted */
  cap: number;
  /** The profit that the publisher get for every sale */
  royalties: number;
  /** The price of the asset */
  assetRewards: AssetRewards;
  /** The amount of NFTs that an address needs to hold in order to access the DID's protected assets. Leave it undefined and it will default to 1. */
  nftAmount?: number;
  /** The erc20 token address which the buyer will pay the price */
  erc20TokenAddress?: string;
  /** If assets are minted in the creation process */
  preMint?: boolean;
  /**  url to set at publishing time that resolves to the metadata of the nft as expected by opensea
   * @url https://docs.opensea.io/docs/metadata-standards
   */
  nftMetadata?: string;
  /** Trasaction number of the asset creation */
  txParams?: TxParameters;
}

/**
 * Authorization needed to request to Marketplace Api
 */
export interface MarketplaceAPIToken {
  /**
   * Token generated by Marketplace Api after login
   */
  token: string;
}

/**
 * Config network to connect with dapp
 */
interface ChainNetwork {
  /** Chain id of the network */
  chainId: string;
  /** Chain name of the network */
  chainName: string;
  /** Native currency of the network
   * @example
   * Ethereum blockchain -> Ethereum currency
   */
  nativeCurrency: {
    /** Name of the token */
    name: string;
    /** Nick of the token
     * @example
     * Ethereum -> ETH
     */
    symbol: string;
    /** Decimals of the token */
    decimals: number;
  };
  /** RPC url to request to the network blockchain */
  rpcUrls: string[];
  /** Url to explore the transactions from specific network */
  blockExplorerUrls: string[];
  /** The icon which represent the network */
  iconUrls: string[];
}

/**
 * Config with all the networks which can be connect by the dapp
 * 
 * @example
 * Config example:
 * ```ts
 * import { zeroX } from '@nevermined-io/nevermined-sdk-js/dist/node/utils';
 *import { acceptedChainId } from 'config';
 *
 *const acceptedChainIdHex = zeroX((+acceptedChainId).toString(16));
 *const spreeChainId = zeroX((8996).toString(16));
 *const polygonLocalnetChainId = zeroX((8997).toString(16));
 *export const mumbaiChainId = zeroX((80001).toString(16));
 *const mainnetChainId = zeroX((137).toString(16));
 *
 *const ChainConfig = {
 *  development: {
 *    chainId: acceptedChainIdHex === spreeChainId ? spreeChainId : polygonLocalnetChainId,
 *    chainName: 'Localhost development',
 *    nativeCurrency: {
 *      name: 'Ethereum',
 *      symbol: 'ETH',
 *      decimals: 18
 *    },
 *    rpcUrls: ['http://localhost:8545'],
 *    blockExplorerUrls: [''],
 *    iconUrls: ['https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png']
 *  },
 *  mumbai: {
 *    chainId: mumbaiChainId,
 *    chainName: 'Polygon Testnet Mumbai',
 *    nativeCurrency: {
 *      name: 'Matic',
 *      symbol: 'MATIC',
 *      decimals: 18
 *    },
 *    rpcUrls: [
 *      'https://matic-mumbai.chainstacklabs.com',
 *      'https://rpc-endpoints.superfluid.dev/mumbai'
 *    ],
 *    blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
 *    iconUrls: ['https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png']
 *  },
 *  mainnet: {
 *    chainId: mainnetChainId,
 *    chainName: 'Polygon Mainnet',
 *    nativeCurrency: {
 *      name: 'Matic',
 *      symbol: 'MATIC',
 *      decimals: 18
 *    },
 *    rpcUrls: ['https://polygon-rpc.com'],
 *    blockExplorerUrls: ['https://polygonscan.com/'],
 *    iconUrls: ['https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png']
 *  },
 *  returnConfig: (chainIdHex: string) => {
 *    if (chainIdHex === spreeChainId || chainIdHex === polygonLocalnetChainId) {
 *      return ChainConfig.development;
 *    }
 *    if (chainIdHex === mumbaiChainId) {
 *      return ChainConfig.mumbai;
 *    }
 *    if (chainIdHex === mainnetChainId) {
 *      return ChainConfig.mainnet;
 *    }
 *    return ChainConfig.development;
 *  }
 *};
 * ```
 */
export interface ChainConfig {
  /** Networks settings */
  [network: string]: ChainNetwork | ((chainIdHex: string) => ChainNetwork);
  /** Return the network confing by giving chain Id in Hexadecimal */
  returnConfig: (chainIdHex: string) => ChainNetwork;
}

/** The asset file detail */
export interface AssetFile {
  /** custom parameters for the Asset file */
  [key: string]: any;
  /** File type: json, txt, etc... */
  type: string;
  /** File title */
  label: string;
}

/** Asset parameters needed to publish */
export interface AssetPublishParams {
    /** custom parameters for the Asset */
  [key: string]: any;
  /** Name of the asset */
  name: string;
  /** Who create the asset */
  author: string;
  /** Description about what is the utility of the asset */
  description: string
  /** The type of the asset */
  type: string;
  /** The category that belong the asset */
  category: string;
  /** Price of the asset */
  price: number;
  /** Files to download after buy the asset */
  assetFiles: AssetFile[];
}

/** Metadata of the file */
export interface FileMetadata {
  /** Index given to the file once it was created */
  index: number;
  /** Format of the contet file: Json, txt, etc... */
  contentType: string;
  /** Url where is located the file */
  url: string;
  /** The size of the content */
  contentLength: string;
}

/**
 * Events full filled
 */
export interface FullfilledOrders {
  /** Document id of the event */
  _documentId: string;
}

/**
 * To registe a event from the blockchain
 */
export interface RegisterEvent {
  /** Id of the asset */
  _did: string;
  /** Owner of the asset */
  _owner: string;
  /** The last modification of the asset */
  _lastUpdatedBy: string;
  /** The block number of the blockchain which the asset was updated */
  _blockNumberUpdated: any; //Wei
}

/** Transfer envent */
export interface Transfer {
  /** Id of the transfer event */
  id: string;
  /** Id of the asset */
  _did: string;
  /** Agreement Id of the asset */
  _agreementId: string;
  /** Which account receive the asset */
  _receiver: string;
}

export interface SubscriptionActions {
  /**
   * Order a NFT asset and transfer and delegate it to the subscription buyer
   * @param subscriptionDid Id of the NFT to subscribe
   * @param buyer The account who buy the subscription of the NFT asset
   * @param nftHolder The owner of the NFT asset
   * @param nftAmount The amount of NFT asset to buy
   * @param nftType NFT asset type which can be 721 or 1155
   * @returns It is true if the subscription was successfully completed
   */
  buySubscription: (
    subscriptionDid: string,
    buyer: Account,
    nftHolder: string,
    nftAmount: number,
    nftType: NftTypes
  ) => Promise<string>;
}

export type { NftTypes } from '@nevermined-io/nevermined-sdk-js/dist/node/gateway/Gateway';
