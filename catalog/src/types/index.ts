import {
  NeverminedOptions,
  DDO,
  MetaData,
  Nevermined,
  SearchQuery,
  ContractEventSubscription,
  EventResult,
  QueryResult,
  EncryptionMethod,
  BigNumber,
  PublishMetadata,
  ERCType,
  AssetAttributes,
  NFTAttributes,
  TxParameters,
  Babysig,
  CreateProgressStep,
  RoyaltyKind,
  OrderProgressStep,
} from '@nevermined-io/sdk'
import { CryptoConfig } from '@nevermined-io/sdk-dtp'

export * from '@nevermined-io/sdk'
export * from '@nevermined-io/sdk-dtp'

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
  sdk: Nevermined
  /** Error message from sdk */
  sdkError: any
  /** Config object used to initialize Nevermined */
  config: NeverminedOptions
  /** True if sdk is loading */
  isLoadingSDK: boolean
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
   *         web3ProviderUri: network,
   *         web3ProviderUri,
   *         neverminedNodeUri,
   *         neverminedNodeAddress,
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
  updateSDK: (newConfig: NeverminedOptions) => Promise<boolean>
  /**
   * `subscribe` contains all the functionalities to handle events
   *
   * @example
   * Subcribe payment event:
   *
   * ```tsx
   * const Example = () => {
   *  const { nfts, subscription, account, isLoadingSDK} = Catalog.useNevermined();
   *  const { paymentEvent, setPaymentEvent } = useState<ContractEventSubscription>();
   *
   *  const buy = async () => {
   *   const response = await nfts.access(ddo.id, owner, BigNumber.from(1), 1155);
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
  subscribe: SubscribeModule
  /**
   * `assets` contains all the functionalities to handle assets for example get,
   * mint, transfer, order or download asset
   *
   * @example
   * Publish an asset example:
   *
   * ```tsx
   * const Example = () => {
   *  const { isLoadingSDK, sdk, account, assets } = Catalog.useNevermined();
   *  const [ddo, setDDO] = useState<DDO>({} as DDO)
   *
   *  const metadata: MetaData = {
   *    main: {
   *      name: 'my app',
   *      files: [{
   *        index: 0,
   *        contentType: 'application/json',
   *        url: 'https://github.com/nevermined-io/docs/blob/master/docs/architecture/specs/metadata/examples/ddo-example.json'
   *      }],
   *      type: 'dataset',
   *      author: 'My company',
   *      license: '',
   *      dateCreated: new Date().toISOString(),
   *    }
   *  };
   *
   *  const onPublish = async () => {
   *   try {
   *     const rewardsRecipients: any[] = [];
   *     const assetPriceMap = new Map([
   *        [walletAddress, BigNumber.from(1)]
   *     ])
   *     const assetPrice = new AssetPrice(assetPriceMap);
   *     const royaltyAttributes = {
   *       royaltyKind: RoyaltyKind.Standard,
   *       scheme: getRoyaltyScheme(sdk, RoyaltyKind.Standard),
   *       amount: 0,
   *     };
   *
   *     const nftAttributes = NFTAttributes.getNFT1155Instance({
   *       metadata,
   *       serviceTypes: ['nft-sales-proof', 'nft-access'],
   *       cap: BigNumber.from(100),
   *       amount: BigNumber.from(1),
   *       preMint: true,
   *       nftContractAddress: token.address,
   *       price: assetPrice,
   *       royaltyAttributes
   *     })
   *
   *     const response = await publishNFT1155({
   *       nftAttributes,
   *     });
   *
   *     setDDO(response as DDO);
   *   } catch (error) {
   *     console.log('error', error);
   *   }
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
  assets: AssetsModule
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
  account: AccountModule
  /**
   * `nfts` contains all the functionalities to handle nfts by payment
   *
   * @example
   * Buy nfts example
   *
   * ```tsx
   * const BuyAsset = ({ddo}: {ddo: DDO}) => {
   *  const { assets, account, isLoadingSDK, nfts, sdk } = Catalog.useNevermined();
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
   *    const response = await nfts.access({
   *      did:ddo.id,
   *      nftHolder: owner,
   *      nftAmount: BigNumber.from(1),
   *      ercType: 1155});
   *    setIsBought(response);
   *  };
   *
   *  const download = async () => {
   *    await assets.downloadNFT({ did: ddo.id });
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
  nfts: NFTSModule
}

/**
 * Nevermined Provider to get the core Catalog functionalities as context
 */
export interface NeverminedProviderProps {
  /** This provider require children elements */
  children: any
  /** The config needed to build Nevermined SDK */
  verbose?: boolean
  /** Show Catalog logs in console logs if it sets to `true` */
  config: NeverminedOptions
}

/**
 * Used as a result data schema of a resolved promise
 */
export interface GenericOutput<T, E> {
  /** Data from the promise */
  data: T
  /** If the promise throw an error */
  error: E
  /** If the promise resolve was success */
  success: boolean
}

/** Id of the asset */
export type DID = string

/**
 * Details of the NFT asset agreement
 */
export interface NFTDetails {
  /** The owner of the asset */
  owner: string
  /** The last checksum generated to verify the sources */
  lastChecksum: string
  /** Url where is located the asset */
  url: string
  /** The modification of the asset */
  lastUpdatedBy: string
  /** The block number from blockchain where the asset was updated */
  blockNumberUpdated: number
  /** Which services provide the asset */
  providers: [string]
  /** The amount of ntfs that are in circulation */
  nftSupply: BigNumber
  /** Contract NFT address which was created the NFT asset*/
  nftContractAddress: string
  /** When the NFT asset was initialized*/
  nftInitialized: string
  /** Uri of the NFT */
  nftURI?: string
  /** The amount limit of nft which can be minted */
  mintCap: BigNumber
  /** The rewards that the owner can get for every sale */
  royalties: number
  /** Royalty scheme of the NFT asset */
  royaltyScheme: RoyaltyKind
}

export enum State {
  /** Entity disable or not available */
  Disabled = 'disabled',
  /** Entity not validated yet or incomplete */
  Unconfirmed = 'unconfirmed',
  /** Entity created */
  Confirmed = 'confirmed',
}

export enum TransferNFTConditionMethod {
  nft1155 = 'transferNftCondition',
  nft721 = 'transferNft721Condition',
}

/** User profile parameters based of the user profile entity */
export interface UserProfileParams {
  /** Id of the user */
  userId: string
  /** The user can be shown */
  isListed: boolean
  /** The state of the user account */
  state: State
  /** The nickname of the user */
  nickname: string
  /** The real name of the user */
  name: string
  /** The email of the user */
  email: string
  /** When the user was created */
  creationDate: string
  /** When was the last user profile updated*/
  updateDate: Date
  /** Additional information of the user like picture, profesional profire, etc... */
  additionalInformation: unknown
}

/** Custom token detail */
export interface CustomErc20Token {
  /** The nick of the token
   * @example
   * Ethereum -> ETH
   */
  symbol: string
  /** Name of the token */
  name: string
  /** Amount of tokens holded by the wallet account */
  balance: BigNumber
  /** Decimals of the token */
  decimals: number
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
  getReleases: (address: string) => Promise<DID[]>
  /**
   * Get the assets bought by the address given
   * @param address The address which bought the assets returned
   * @returns List of assets which was bought by the address given as argument
   */
  getCollection: (address: string) => Promise<DID[]>
  /**
   * Get only published Subscriptions
   * @param address the address which published the subscription returned
   * @returns published subscriptions
   */
  getPublishedSubscriptions: (address: string) => Promise<DDO[]>
  /**
   * Get all the services associated
   * @param address the address which published the subscription returned
   * @returns associated services to subscriptions
   */
  getAssociatedServices: (did: string) => Promise<DDO[]>
  /**
   * Get all the published subscriptions and services associated from the wallet address passed
   * Get only published Subscriptions
   * @param did the did of the subscription
   * @returns published subscriptions and service
   */
  getPublishedSubscriptionsAndServices: (address: string) => Promise<SubscriptionsAndServicesDDOs[]>
  /**
   * Get only purchased Subscriptions
   * @param address the address which purchased the subscription returned
   * @returns purchased subscriptions
   */
  getPurchasedSubscriptions: (address: string) => Promise<DDO[]>
  /**
   * Get all the purchased subscriptions and services associated from the wallet address passed
   * @param address the address which published the subscription returned
   * @returns purchased subscriptions and services
   */
  getPurchasedSubscriptionsAndServices: (address: string) => Promise<SubscriptionsAndServicesDDOs[]>
  /**
   * Generate a token for authentication in the Marketplace API
   * @returns The new generated token
   */
  generateToken: () => Promise<MarketplaceAPIToken>
  /**
   * check if the token for Marketplace API is valid
   * @returns if token is valid it will return true
   */
  isTokenValid: () => boolean
  /**
   * Return the address that sign the token
   * @return The address token signer
   */
  getAddressTokenSigner: () => string
  /**
   * This method validates if an user is an asset holder.
   *
   * @param did The unique identifier of the asset
   * @param walletAddress The public address of the user
   * @returns true if the user owns at least one edition of the NFT
   */
  isAssetHolder: (did: string, walletAddress: string) => Promise<boolean>
  /**
   * This method validates if a user is a NFT (ERC-1155 based) holder for a specific `tokenId`.
   * For ERC-1155 tokens, we use the DID as tokenId. A user can between zero an multiple editions
   * of a NFT (limitted by the NFT cap).
   *
   * @param did The unique identifier of the NFT within a NFT ERC-1155 contract
   * @param walletAddress The public address of the user
   * @returns true if the user owns at least one edition of the NFT
   */
  isNFT1155Holder: (did: string, walletAddress: string) => Promise<boolean>
  /**
   * This method validates if a user is a NFT (ERC-721 based) holder for a specific NFT contract address.
   * For ERC-721 tokens, we use the DID as tokenId. A user can between zero an multiple editions
   * of a NFT (limitted by the NFT cap).
   *
   * @param nftAddress The contract address of the ERC-721 NFT contract
   * @param walletAddress The public address of the user
   * @returns true if the user holds the NFT
   */
  isNFT721Holder: (nftAddress: string, walletAddress: string) => Promise<boolean>
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
  findOne: (did: DID) => Promise<DDO>
  /**
   *
   * @param q Query to custom the search: order result, filtering, etc...
   * @returns List of assets according with the query given
   */
  query: (q: SearchQuery) => Promise<QueryResult>
  /**
   * Transfer the ownership of the asset to other account
   * @param assetInfo
   * @param assetInfo.did The id of the asset
   * @param assetInfo.amount The amount of asset to transfer
   * @param assetInfo.ercType NFT asset type which can be 721 or 1155
   * @returns Return true if asset was transferred successfully
   */
  transfer: ({
    did,
    amount,
    ercType,
  }: {
    did: string
    amount: number
    ercType: ERCType
  }) => Promise<boolean>
  /**
   * Get the aggreement details of the NFT asset (owner, nfts supplay, royalties, etc...)
   * @param did id of the NFT (721 & 1155) asset
   * @param ercType NFT asset type which can be 721 or 1155
   * @returns Agreement details of the NFT asset
   */
  nftDetails: (did: string, ercType: ERCType) => Promise<NFTDetails>
  /**
   * This method order a asset to allow after transfer to the buyer (the method only order but not transfer)
   * @param did id of the asset
   * @returns In case the order is completed successfully it returns the agreementId
   * which is needed to transfer the asset to the buyer
   */
  orderAsset: (did: string) => Promise<string>
  /**
   * This method order a NFT721 asset to allow after transfer to the buyer (the method only order but not transfer)
   * @param did id of the NFT721 asset
   * @param amount Amount of NFT721 assets to order
   * @returns In case the order is completed successfully it returns the agreementId
   * which is needed to transfer the NFT721 asset to the buyer
   */
  orderNFT721: (did: string, nftTokenAddress: string) => Promise<string>
  /**
   * This method order a NFT1155 asset to allow after transfer to the buyer (the method only order but not transfer)
   * @param did id of the NFT1155 asset
   * @param amount Amount of NFT1155 assets to order
   * @returns In case the order is completed successfully it returns the agreementId
   * which is needed to transfer the NFT1155 asset to the buyer
   */
  orderNFT1155: (did: string, amount: BigNumber) => Promise<string>
  /**
   * Download a NFT asset already ordered and transfered to the buyer,
   * if the user is the owner of the asset
   * @param nft
   * @param nft.did id of the NFT (721 & 1155) asset
   * @param nft.ercType NFT type. By default 1155
   * @param nft.path Destination of downloaded file
   * @param nft.fileIndex The file to download. If not given or is -1 it will download all of them
   * @param nft.password Password to download a encrypted NFT
   * @param nft.accountIndex account index of the account list wallet, it is used for testing purpose
   * @returns if the NFT is downloaded successfully the method will return a true
   */
  downloadNFT: ({
    did,
    ercType,
    path,
    fileIndex,
    password,
    accountIndex,
  }: {
    did: string
    ercType?: ERCType
    path?: string
    fileIndex?: number
    password?: string
    accountIndex?: number
  }) => Promise<boolean | string>
  /**
   * Get all the details about a custom erc20 token
   * @param customErc20TokenAddress The custom token address
   * @returns Custom token details
   */
  getCustomErc20Token: (customErc20TokenAddress: string) => Promise<CustomErc20Token>
  /**
   * Download an asset already ordered and transfered to the buyer,
   * if the user is the owner of the asset
   * @param asset
   * @param asset.did id of the NFT (721 & 1155) asset
   * @param asset.path Destination of downloaded file
   * @param asset.fileIndex The file to download. If not given or is -1 it will download all of them
   * @param asset.password Password to download a encrypted NFT
   * @param asset.accountIndex account index of the account list wallet, it is used for testing purpose
   * @returns if the NFT is downloaded successfully the method will return a true
   */
  downloadAsset: ({
    did,
    fileIndex,
    path,
    password,
    accountIndex,
  }: {
    did: string
    fileIndex?: number
    path?: string
    password?: string
    accountIndex?: number
  }) => Promise<boolean>
  /**
   * Upload files to Filecoin
   * @param file The file to upload to Filecoin
   * @param filecoinUrl The url of the Filecoin server
   * @returns The url where is located the file already uploaded
   */
  uploadAssetToFilecoin: (File: File, filecoinUrl: string) => Promise<string>
}

/**
 * `subscribe` contains all the functionalities to handle events
 *
 * @example
 * Subcribe payment event:
 *
 * ```tsx
 * const Example = () => {
 *  const { nfts, subscription, account, isLoadingSDK} = Catalog.useNevermined();
 *  const { paymentEvent, setPaymentEvent } = useState<ContractEventSubscription>();
 *
 *  const buy = async () => {
 *   const currentAccount = await getCurrentAccount(sdk);
 *   const response = await nfts.access({
 *      did: ddo.id,
 *      nftHolder: owner,
 *      nftAmount: BigNumber.from(1),
 *      ercType: 1155
 *   });
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
  paymentEvents: (cb: (events: EventResult[]) => void) => ContractEventSubscription
  /**
   * Subscribe a `transfer` event and execute callbacks once that this event is listened
   * @param cb Callback to execute
   * @param ercType NFT asset type which can be 721 or 1155
   * @returns return the `transfer` event with a functionality to unsubscribe
   */
  transferEvents: (
    cb: (events: EventResult[]) => void,
    nftType?: ERCType,
  ) => ContractEventSubscription
}

/**
 * Response from "useAsset"
 */
export interface AssetState {
  /** Asset object */
  ddo: DDO
  /** Metada of the asset with the basic information */
  metadata: MetaData
  /** Error message from some operation with asset */
  error: string
  /** True if asset object is loaded */
  isLoading: boolean
  /** Details of the asset agreement */
  nftDetails: NFTDetails
}

/**
 * Authorization needed to request to Marketplace Api
 */
export interface MarketplaceAPIToken {
  /**
   * Token generated by Marketplace Api after login
   */
  token: string
}

/** The asset file detail */
export interface AssetFile {
  /** custom parameters for the Asset file */
  [key: string]: any
  /** File type: json, txt, etc... */
  type: string
  /** File title */
  label: string
}

/** Asset parameters needed to publish */
export interface AssetPublishParams {
  /** custom parameters for the Asset */
  [key: string]: any
  /** Name of the asset */
  name: string
  /** Who create the asset */
  author: string
  /** Description about what is the utility of the asset */
  description: string
  /** The type of the asset */
  type: string
  /** The category that belong the asset */
  category: string
  /** Price of the asset */
  price: number
  /** Files to download after buy the asset */
  assetFiles: AssetFile[]
}

/** Metadata of the file */
export interface FileMetadata {
  /** Index given to the file once it was created */
  index: number
  /** Format of the contet file: Json, txt, etc... */
  contentType: string
  /** Url where is located the file */
  url: string
  /** The size of the content */
  contentLength: string
}

/**
 * Events fulfilled
 */
export interface FulfilledOrders {
  /** Document id of the event */
  _documentId: string
}

/**
 * To registe a event from the blockchain
 */
export interface RegisterEvent {
  /** Id of the asset */
  _did: string
  /** Owner of the asset */
  _owner: string
  /** The last modification of the asset */
  _lastUpdatedBy: string
  /** The block number of the blockchain which the asset was updated */
  _blockNumberUpdated: any //Wei
}

/** Transfer envent */
export interface Transfer {
  /** Id of the transfer event */
  id: string
  /** Id of the asset */
  _did: string
  /** Agreement Id of the asset */
  _agreementId: string
  /** Which account receive the asset */
  _receiver: string
}

export interface NFTSModule {
  /**
   * Order a NFT asset and transfer and delegate it to the buyer
   * @param access
   * @param access.did Id of the NFT to subscribe
   * @param access.nftHolder The owner of the NFT asset
   * @param access.nftAmount The amount of NFT asset to buy
   * @param access.ercType NFT asset type which can be `721` or `1155`
   * @param access.password Password to desencrypt metadata
   * @param access.accountIndex account index of the account list wallet, it is used for testing purpose
   * @param asset.onEvent A callback to handle progress events
   * @returns It is successfully completed will return the `agreementId`
   */
  access: ({
    did,
    nftHolder,
    nftAmount,
    ercType,
    password,
    accountIndex,
    onEvent,
  }: {
    did: string
    nftHolder: string
    nftAmount: BigNumber
    ercType: ERCType
    password?: string
    accountIndex?: number
    onEvent?: (next: OrderProgressStep) => void
  }) => Promise<string>
}

/**
 * Provider with all the functionalities to publish assets (no-nft, nft721, nft1155)
 */
export interface AssetPublishProviderState {
  /** Handle error publish asset message */
  errorAssetMessage: string
  /** Handle publish asset message */
  assetMessage: string
  /** If the asset was published correctly */
  isPublished: boolean
  /** If the asset is publishing*/
  isProcessing: boolean
  /** All the parameters needed to publish an asset */
  assetPublish: AssetPublishParams
  /** Set parameters needed to publish an asset */
  setAssetPublish: React.Dispatch<React.SetStateAction<AssetPublishParams>>
  /** Set asset message */
  setAssetMessage: React.Dispatch<React.SetStateAction<string>>
  /** Set error asset message */
  setErrorAssetMessage: React.Dispatch<React.SetStateAction<string>>
  /** Update asset parameters when some input changes
   * @param value Parameter value
   * @param input Input where come the changes which match with the parameters
   */
  handleChange: (value: string, input: string) => void
  /** Reset all the parameters of the asset
   * @param resetAssetPublish Initial parameters used for reset
   */
  reset: (resetAssetPublish: AssetPublishParams) => void
  /**
   * Nevermined is a network where users register digital assets and attach to
   * them services (like data sharing, nfts minting, etc).
   * With this method a user can register an asset in Nevermined giving a piece of metadata.
   * This will return the DDO created (including the unique identifier of the asset - aka DID).
   *
   * @param asset
   * @param asset.assetAttributes The attribute object discribing the asset (metadata, price, encryption method, etc...)
   * @param asset.publishMetadata Allows to specify if the metadata should be stored in different backends
   * @param asset.txParams Optional transaction parameters
   * @param asset.password Password to encrypt metadata
   * @param asset.cryptoConfig Setting for encrypting asset
   * @param asset.onEvent A callback to handle progress events
   * @returns The DDO object including the asset metadata and the DID
   */
  publishAsset: ({
    assetAttributes,
    publishMetadata,
    txParameters,
    password,
    cryptoConfig,
    onEvent,
  }: {
    assetAttributes: AssetAttributes
    publishMetadata?: PublishMetadata
    txParameters?: TxParameters
    method?: EncryptionMethod
    password?: string
    cryptoConfig?: CryptoConfig
    onEvent?: (next: CreateProgressStep) => void
  }) => Promise<DDO | undefined>
  /**
   * In Nevermined is possible to register a digital asset that allow users pay for having a
   * NFT (ERC-721). This typically allows content creators to provide access to exclusive
   * contents for NFT holders.
   * It will create a new digital asset associated to a ERC-721 NFT contract
   * (given the `nftAddress` parameter)
   *
   * @param nft721
   * @param nft721.nftAttributes The attribute object discribing the asset (metadata, price, encryption method, etc...)
   * @param nft721.nftAddress NFT721 contract address to load
   * @param nft721.publishMetadata Allows to specify if the metadata should be stored in different backends
   * @param nft721.txParams Optional transaction parameters
   * @param nft721.password Password to encrypt metadata
   * @param nft721.cryptoConfig Setting for encrypting asset
   * @param nft721.onEvent A callback to handle progress events
   * @returns The DDO object including the asset metadata and the DID
   */
  publishNFT721: ({
    nftAttributes,
    nftAddress,
    publishMetadata,
    txParameters,
    password,
    cryptoConfig,
    onEvent,
  }: {
    nftAttributes: NFTAttributes
    nftAddress: string
    publishMetadata?: PublishMetadata
    txParameters?: TxParameters
    method?: EncryptionMethod
    password?: string
    cryptoConfig?: CryptoConfig
    onEvent?: (next: CreateProgressStep) => void
  }) => Promise<DDO | undefined>
  /**
   * In Nevermined is possible to register a digital asset that allow users pay for having a
   * NFT (ERC-1155). This typically allows content creators to provide access to exclusive
   * contents for NFT holders.
   * ERC-1155 NFTs are semi-fungible, meaning that a NFT can have multiple editions.
   *
   * This method will create a new digital asset associated to a ERC-1155 NFT contract.
   *
   * @param nft1155
   * @param nft1155.nftAttributes The attribute object discribing the asset (metadata, price, encryption method, etc...)
   * @param nft1155.publishMetadata Allows to specify if the metadata should be stored in different backends
   * @param nft1155.txParams Optional transaction parameters
   * @param nft1155.password Password to encrypt metadata
   * @param nft1155.cryptoConfig Setting for encrypting asset
   * @param nft1155.onEvent A callback to handle progress events
   * @returns The DDO object including the asset metadata and the DID
   */
  publishNFT1155: ({
    nftAttributes,
    publishMetadata,
    txParameters,
    password,
    cryptoConfig,
    onEvent,
  }: {
    nftAttributes: NFTAttributes
    publishMetadata?: PublishMetadata
    txParameters?: TxParameters
    method?: EncryptionMethod
    password?: string
    cryptoConfig?: CryptoConfig
    onEvent?: (next: CreateProgressStep) => void
  }) => Promise<DDO | undefined>
}

export interface Credentials {
  buyer: string
  babySig: Babysig
}

export interface SubscriptionsAndServicesDDOs {
  subscription: DDO
  services: DDO[]
}
