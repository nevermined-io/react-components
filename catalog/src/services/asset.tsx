import React, { useContext, useEffect, useState, createContext } from 'react'
import { NeverminedContext, useNevermined } from '../catalog'
import { 
  AssetState,
  AssetPublishParams,
  AssetPublishProviderState,
  TxParameters,
  QueryResult,
  DDO,
  MetaData,
  SearchQuery,
  ClientError,
  Logger,
  AssetAttributes,
  NFTAttributes,
  PublishMetadata,
  ERCType,
  CryptoConfig,
  CreateProgressStep,
  Account,
} from '../types'
import { executeWithProgressEvent } from '../utils'
import {_getDTPInstance, _encryptFileMetadata} from '../utils/dtp'

/**
 * Get all assets
 * @param q - assets query
 * @example
 * ```tsx
 * const MyComponent = () => {
 *  const {  result, isLoading } = AssetService.useAssets();
 *
 *  return (
 *   <>
 *      {result.results.map((d: DDO) => {
 *          return (
 *              <div>
 *              {JSON.stringify(d)}
 *              </div>
 *          )
 *      })}
 *   </>
 *  )
 * }
 * ```
 */
export const useAssets = (
  q: SearchQuery
): {
  /** Result based in the query search requested */
  result: QueryResult;
  /** If the query is still processing */
  isLoading: boolean;
} => {
  const { assets, sdk } = useContext(NeverminedContext)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<QueryResult>({} as QueryResult)

  const handler = async () => {
    try {
      if (!q) return
      setIsLoading(true)
      const queryResponse: QueryResult = await assets.query(q)
      setResult(queryResponse)
      setIsLoading(false)
    } catch (error: any) {
      Logger.error(error.message)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isLoading) return
    handler()
  }, [assets, sdk, q])

  return {
    result,
    isLoading
  }
}

/**
 * Get single asset
 * @param did - asset did
 * @example
 * ```tsx
 * const MyComponent = () => {
 *  const did = "did";
 *  const { ddo } = AssetService.useAsset(did);
 *
 *  return (
 *   <>
 *     {JSON.stringify(ddo)}
 *   </>
 *  )
 * }
 * ```
 */
export const useAsset = (did: string, ercType: ERCType): AssetState => {
  const { assets } = useContext(NeverminedContext)
  const [state, setState] = useState<AssetState>({} as AssetState)

  useEffect(() => {
    const getData = async () => {
      try {
        const ddo: DDO | undefined = await assets.findOne(did)
        if (!ddo) return
        const metaData: MetaData = ddo.findServiceByType('metadata').attributes
        const nftDetails = await assets.nftDetails(did, ercType)
        setState({
          ddo,
          metadata: metaData,
          nftDetails,
          error: '',
          isLoading: false
        } as AssetState)
      } catch (e) {
        Logger.error(e as Error)
      }
    }
    getData()
  }, [did, assets])

  return { ...state }
}

export const AssetPublishContext = createContext({} as AssetPublishProviderState)

/**
 * Provider with all the functionalities to publish assets (no-nft, nft721, nft1155)
 * 
 * Here is an example how to implement it
 * @see {@link https://github.com/nevermined-io/defi-marketplace/tree/main/client/src/%2Bassets/user-publish-steps}
 */
export const AssetPublishProvider = ({ children }: { children: React.ReactElement }) => {
  const { sdk, account, config } = useNevermined()
  const [errorAssetMessage, setErrorAssetMessage] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [assetMessage, setAssetMessage] = useState('')
  const [assetPublish, setAssetPublish] = useState<AssetPublishParams>({
    name: '',
    author: '',
    description: '',
    type: 'dataset',
    category: 'None',
    price: '',
    assetFiles: []
  })

  const reset = (resetAssetPublish: AssetPublishParams) => {
    setAssetPublish(resetAssetPublish)

    setIsPublished(false)
    setAssetMessage('')
    setErrorAssetMessage('')
  }

  const handleChange = (value: string, input: string) => {
    setAssetPublish({ ...assetPublish, [input]: value })
  }

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
   * @param asset.method Method used to encrypt the urls
   * @param asset.password Password to encrypt metadata
   * @param asset.onEvent A callback to handle progress events
   * @param asset.publisher The user account
   * @returns The DDO object including the asset metadata and the DID
   */
  const publishAsset = async ({
    assetAttributes,
    publishMetadata = PublishMetadata.OnlyMetadataAPI,
    txParameters,
    password,
    cryptoConfig,
    onEvent,
    publisher,
  }:
  {
    assetAttributes: AssetAttributes;
    publishMetadata?: PublishMetadata;
    txParameters?: TxParameters,
    password?: string,
    cryptoConfig?: CryptoConfig,
    onEvent?: (next: CreateProgressStep) => void,
    publisher: Account
  }) => {
    try {
      setIsProcessing(true)

      if (!account.isTokenValid() || account.getAddressTokenSigner().toLowerCase() !== publisher.getId().toLowerCase()) {
        Logger.error(
          'Your login is expired or not valid'
        )

        await account.generateToken(publisher)
      }

      if (password) {
        const dtp = await _getDTPInstance(sdk, config, cryptoConfig || null as any)
        const metadata = await _encryptFileMetadata(sdk, dtp, assetAttributes.metadata, password)
        assetAttributes.metadata = {...metadata}
      }

      const ddo = await executeWithProgressEvent(() => sdk.assets.create(
        assetAttributes,
        publisher,
        publishMetadata,
        txParameters,
      ), onEvent)

      setIsProcessing(false)
      setIsPublished(true)
      setAssetMessage('The asset has been sucessfully published')
      setErrorAssetMessage('')
      return ddo
    } catch (error: any) {
      Logger.error(error.message)
      setErrorAssetMessage('There was an error publishing the asset')
      setAssetMessage('')
      setIsProcessing(false)
      throw new ClientError(error.message, 'Catalog')
    }
  }

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
   * @param nft721.method Method used to encrypt the urls
   * @param nft721.password Password to encrypt metadata
   * @param nft721.onEvent A callback to handle progress events
   * @param nft721.publisher The user account*
   * @returns The DDO object including the asset metadata and the DID
   */
  const publishNFT721 = async ({
    nftAttributes,
    nftAddress,
    publishMetadata = PublishMetadata.OnlyMetadataAPI,
    txParameters,
    password,
    cryptoConfig,
    onEvent,
    publisher
  }:
  {
    nftAttributes: NFTAttributes;
    nftAddress: string;
    publishMetadata?: PublishMetadata;
    txParameters?: TxParameters,
    password?: string,
    cryptoConfig?: CryptoConfig,
    onEvent?: (next: CreateProgressStep) => void,
    publisher: Account
  }) => {
    try {
      setIsProcessing(true)

      if (!account.isTokenValid() || account.getAddressTokenSigner().toLowerCase() !== publisher.getId().toLowerCase()) {
        setErrorAssetMessage(
          'Your login is expired. Please first sign with your wallet and after try again'
        )
        await account.generateToken(publisher)
      }

      if (password) {
        const dtp = await _getDTPInstance(sdk, config, cryptoConfig || null as any)
        const metadata = await _encryptFileMetadata(sdk, dtp, nftAttributes.metadata, password)
        nftAttributes.metadata = {...metadata}
      }

      await sdk.contracts.loadNft721(nftAddress)

      const ddo = await executeWithProgressEvent(() => sdk.nfts721.create(
        nftAttributes,
        publisher,
        publishMetadata,
        txParameters,
      ), onEvent)

      setIsProcessing(false)
      setIsPublished(true)
      setAssetMessage('The asset NFT 721 has been sucessfully published')
      setErrorAssetMessage('')
      return ddo
    } catch (error: any) {
      Logger.error(error.message)
      setErrorAssetMessage('There was an error publishing the asset NFT 721')
      setAssetMessage('')
      setIsProcessing(false)
      throw new ClientError(error.message, 'Catalog')
    }
  }

  /**
   * In Nevermined is possible to register a digital asset that allow users pay for having a 
   * NFT (ERC-1155). This typically allows content creators to provide access to exclusive 
   * contents for NFT holders.
   * ERC-1155 NFTs are semi-fungible, meaning that a NFT can have multiple editions.
   * 
   * This method will create a new digital asset associated to a ERC-1155 NFT contract. 
   * 
   * @param nft1155
   * @param nft1155.neverminedNodeAddress Node address to approve to handle the NFT
   * @param nft1155.metadata The metadata object describing the asset
   * @param nft1155.cap The maximum number of editions that can be minted. If `0` means there is no limit (uncapped)
   * @param nft1155.assetRewards The price of the asset that the owner will receive
   * @param nft1155.royaltyAttributes The amount of royalties paid back to the original creator in the secondary market
   * @param nft1155.nftAmount NFT amount to publish
   * @param nft1155.erc20TokenAddress The erc20 token address which the buyer will pay the price
   * @param nft1155.preMint If assets are minted in the creation process
   * @param nft1155.nftMetadata Url to set at publishing time that resolves to the metadata of the nft as expected by opensea
   * @param nft1155.neverminedNFTType the type of the NFT1155
   * @param nft1155.appId The id of the application creating the NFT
   * @param nft1155.txParameters Trasaction number of the asset creation
   * @param nft1155.onEvent A callback to handle progress events
   * @param nft1155.publisher The user account
   * @returns The DDO object including the asset metadata and the DID
   */
  const publishNFT1155 = async ({
    nftAttributes,
    publishMetadata = PublishMetadata.OnlyMetadataAPI,
    txParameters,
    password,
    cryptoConfig,
    onEvent,
    publisher
  }:
  {
    nftAttributes: NFTAttributes;
    publishMetadata?: PublishMetadata;
    txParameters?: TxParameters,
    password?: string,
    cryptoConfig?: CryptoConfig,
    onEvent?: (next: CreateProgressStep) => void,
    publisher: Account;
  }) => {
    try {
      setIsProcessing(true)

      if (!account.isTokenValid() || account.getAddressTokenSigner().toLowerCase() !== publisher.getId().toLowerCase()) {
        setErrorAssetMessage(
          'Your login is expired. Please first sign with your wallet and after try again'
        )
        await account.generateToken(publisher)
      }

      if (!config.neverminedNodeAddress) {
        Logger.error('neverminedNodeAddress from config is required to mint NFT1155 asset')
        return
      }

      if (password) {
        const dtp = await _getDTPInstance(sdk, config, cryptoConfig)
        const metadata = await _encryptFileMetadata(sdk, dtp, nftAttributes.metadata, password)
        nftAttributes.metadata = {...metadata}
      }

      const ddo = await executeWithProgressEvent(() => sdk.nfts1155.create(
        nftAttributes,
        publisher,
        publishMetadata,
        txParameters
      ), onEvent)

      setIsProcessing(false)
      setIsPublished(true)
      setAssetMessage('The asset NFT 1155 has been sucessfully published')
      setErrorAssetMessage('')
      return ddo
    } catch (error: any) {
      Logger.error(error.message)
      setErrorAssetMessage('There was an error publishing the asset NFT 1155')
      setAssetMessage('')
      setIsProcessing(false)
      throw new ClientError(error.message, 'Catalog')
    }
  }

  const IState = {
    errorAssetMessage,
    assetMessage,
    isPublished,
    isProcessing,
    assetPublish,
    setAssetPublish,
    setAssetMessage,
    setErrorAssetMessage,
    handleChange,
    publishAsset,
    publishNFT721,
    publishNFT1155,
    reset
  }

  return <AssetPublishContext.Provider value={IState}>{children}</AssetPublishContext.Provider>
}

export const useAssetPublish = (): AssetPublishProviderState => useContext(AssetPublishContext)