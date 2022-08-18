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
  sdk: Nevermined;
  sdkError: any;
  isLoadingSDK: boolean;
  updateSDK: (newConfig: Config) => Promise<boolean>;
  subscribe: SubscribeModule;
  assets: AssetsModule;
  account: AccountModule;
  subscription: SubscriptionActions;
}

/**
 * Values needed in order to initialize Catalog.
 * @param children - React component
 * @param verbose - show logs for debug/info
 * @param config -  nevermined Config
 *
 * const MyIndex = () => {
 *      ...
 *      return (
 *      <Catalog.NeverminedProvider config={config} verbose={verbose}>
 *       ..children
 *      </Catalog.NeverminedProvider>
 *      )
 * }
 */
export interface NeverminedProviderProps {
  children: any;
  verbose?: boolean;
  config: Config;
}

export interface GenericOutput<T, E> {
  data: T;
  error: E;
  success: boolean;
}

export type DID = string;

export interface NFTDetails {
  owner: string;
  lastChecksum: string;
  url: string;
  lastUpdatedBy: string;
  blockNumberUpdated: number;
  providers: any;
  nftSupply: number;
  mintCap: number;
  royalties: number;
}

export enum UserProfileState {
  Disabled = 'disabled',
  Unconfirmed = 'unconfirmed',
  Confirmed = 'confirmed'
}

export interface UserProfileParams {
  userId: string;
  isListed: boolean;
  state: UserProfileState;
  nickname: string;
  name: string;
  email: string;
  creationDate: string;
  updateDate: string;
  additionalInformation: unknown;
}

export interface CustomErc20Token {
  symbol: string;
  name: string;
  balance: BigNumber;
  decimals: number;
}

/**
 * AccountModule is exposed by the main context
 * under 'account' object
 */
export interface AccountModule {
  getReleases: (address: string) => Promise<DID[]>;
  getCollection: (address: string) => Promise<DID[]>;
  generateToken: () => Promise<MarketplaceAPIToken>;
  isTokenValid: () => boolean;
  isNFT1155Holder: (did: string, walletAddress: string) => Promise<boolean>;
  isNFT721Holder: (did: string, nftTokenAddress: string, walletAddress: string) => Promise<boolean>;
}

/**
 * AssetsModule is exposed by the main context
 * under 'assets' object
 */
export interface AssetsModule {
  getSingle: (did: DID) => Promise<DDO>;
  query: (q: SearchQuery) => Promise<QueryResult>;
  resolve: (did: DID) => Promise<DDO | undefined>;
  transfer: ({ did, amount }: { did: string; amount: number }) => Promise<boolean>;
  mint: (did: any) => Promise<any>;
  nftDetails: (did: string) => Promise<NFTDetails>;
  orderAsset: (did: string) => Promise<string>;
  orderNFT721: (did: string, nftTokenAddress: string) => Promise<string>;
  orderNFT1155: (did: string) => Promise<string>;
  downloadNFT: (did: string) => Promise<boolean>;
  getCustomErc20Token: (customErc20TokenAddress: string) => Promise<CustomErc20Token>;
  downloadAsset: (did: string, agreementId: string) => Promise<boolean>;
  uploadAssetToFilecoin: (File: File, filecoinUrl: string) => Promise<string>;
}

/**
 * SubscribeModule is exposed by the main context
 * under 'subscribe' object
 */
export interface SubscribeModule {
  paymentEvents: (cb: (events: EventResult[]) => void) => ContractEventSubscription;
  transferEvents: (cb: (events: EventResult[]) => void) => ContractEventSubscription;
}


/**
 * Response from "useAsset"
 */
export interface AssetState {
  ddo: DDO;
  metadata: MetaData;
  error: string;
  isLoading: boolean;
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

export interface MarketplaceAPIToken {
  token: string;
}

interface ChainNetwork {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
  iconUrls: string[];
}

export interface ChainConfig {
  [network: string]: ChainNetwork | ((chainIdHex: string) => ChainNetwork);
  returnConfig: (chainIdHex: string) => ChainNetwork;
}

export interface AssetFile {
  [key: string]: any;
  type: string;
  label: string;
}

export interface AssetPublishParams {
  [key: string]: any;
  name: string;
  author: string;
  description: string;
  type: string;
  category: string;
  price: number;
  assetFiles: AssetFile[];
}

export interface FileMetadata {
  index: number;
  contentType: string;
  url: string;
  contentLength: string;
}

export interface FullfilledOrders {
  _documentId: string;
}

export interface RegisterEvent {
  _did: string;
  _owner: string;
  _lastUpdatedBy: string;
  _blockNumberUpdated: any; //Wei
}

export interface Transfer {
  id: string;
  _did: string;
  _agreementId: string;
  _receiver: string;
}

export interface SubscriptionActions {
  buySubscription: (
    subscriptionDid: string,
    buyer: Account,
    nftHolder: string,
    nftAmount: number,
    nftType: NftTypes
  ) => Promise<boolean>;
}

export type { NftTypes } from '@nevermined-io/nevermined-sdk-js/dist/node/gateway/Gateway';
