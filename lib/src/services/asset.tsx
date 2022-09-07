import { DDO, MetaData, SearchQuery, ClientError, Logger } from '@nevermined-io/nevermined-sdk-js';
import { QueryResult } from '@nevermined-io/nevermined-sdk-js/dist/node/metadata/Metadata';
import AssetRewards from '@nevermined-io/nevermined-sdk-js/dist/node/models/AssetRewards';
import React, { useContext, useEffect, useState, createContext } from 'react';
import { NeverminedContext, useNevermined } from '../catalog';
import { AssetState, AssetPublishParams, RoyaltyKind, AssetPublishProviderState } from '../types';
import BigNumber from '@nevermined-io/nevermined-sdk-js/dist/node/utils/BigNumber';
import { getCurrentAccount } from '../utils';

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
  const { assets, sdk } = useContext(NeverminedContext);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<QueryResult>({} as QueryResult);

  const handler = async () => {
    try {
      if (!q) return;
      setIsLoading(true);
      const queryResponse: QueryResult = await assets.query(q);
      setResult(queryResponse);
      setIsLoading(false);
    } catch (error: any) {
      Logger.error(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    handler();
  }, [assets, sdk, q]);

  return {
    result,
    isLoading
  };
};

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
export const useAsset = (did: string): AssetState => {
  const { assets } = useContext(NeverminedContext);
  const [state, setState] = useState<AssetState>({} as AssetState);

  useEffect(() => {
    const getData = async () => {
      try {
        const ddo: DDO | undefined = await assets.findOne(did);
        if (!ddo) return;
        const metaData: MetaData = ddo.findServiceByType('metadata').attributes;
        const nftDetails = await assets.nftDetails(did);
        setState({
          ddo,
          metadata: metaData,
          nftDetails,
          error: '',
          isLoading: false
        } as AssetState);
      } catch (e) {
        Logger.error(e as Error);
      }
    };
    getData();
  }, [did, assets]);

  return { ...state };
};

export const AssetPublishContext = createContext({} as AssetPublishProviderState);

/**
 * Provider with all the functionalities to publish assets (no-nft, nft721, nft1155)
 * 
 * Here is an example how to implement it
 * @see {@link https://github.com/nevermined-io/defi-marketplace/tree/main/client/src/%2Bassets/user-publish-steps}
 */
export const AssetPublishProvider = ({ children }: { children: React.ReactElement }) => {
  const { sdk, account } = useNevermined();
  const [errorAssetMessage, setAssetErrorMessage] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [assetMessage, setAssetMessage] = useState('');
  const [assetPublish, setAssetPublish] = useState<AssetPublishParams>({
    name: '',
    author: '',
    description: '',
    type: 'dataset',
    category: 'None',
    price: 0,
    assetFiles: []
  });

  const reset = (resetAssetPublish: AssetPublishParams) => {
    setAssetPublish(resetAssetPublish);

    setIsPublished(false);
    setAssetMessage('');
    setAssetErrorMessage('');
  };

  const handleChange = (value: string, input: string) => {
    setAssetPublish({ ...assetPublish, [input]: value });
  };

  /**
   * Nevermined is a network where users register digital assets and attach to 
   * them services (like data sharing, nfts minting, etc).
   * With this method a user can register an asset in Nevermined giving a piece of metadata. 
   * This will return the DDO created (including the unique identifier of the asset - aka DID).
   * 
   * @param metadata The metadata object describing the asset 
   * @returns The DDO object including the asset metadata and the DID
   */
  const publishAsset = async ({ metadata }: { metadata: MetaData }) => {
    try {
      setIsProcessing(true);

      const accountWallet = await getCurrentAccount(sdk);

      const assetRewards = new AssetRewards(
        accountWallet.getId(),
        BigNumber.from(assetPublish.price)
      );
      if (!account.isTokenValid()) {
        setAssetErrorMessage(
          'Your login is expired. Please first sign with your wallet and after try again'
        );
        await account.generateToken();
      }

      const ddo = await sdk.assets.create(metadata, accountWallet, assetRewards);
      setIsProcessing(false);
      setIsPublished(true);
      setAssetMessage('The asset has been sucessfully published');
      setAssetErrorMessage('');
      return ddo;
    } catch (error: any) {
      Logger.error(error.message);
      setAssetErrorMessage('There was an error publishing the asset');
      setAssetMessage('');
      setIsProcessing(false);
      throw new ClientError(error.message, 'Catalog');
    }
  };

  /**
   * In Nevermined is possible to register a digital asset that allow users pay for having a 
   * NFT (ERC-721). This typically allows content creators to provide access to exclusive 
   * contents for NFT holders.
   * It will create a new digital asset associated to a ERC-721 NFT contract 
   * (given the `nftAddress` parameter)
   * 
   * @param nftAddress The contract address of the ERC-721 NFT
   * @param metadata The metadata object describing the asset 
   * @param providers Array that contains the provider addreses 
   * @returns The DDO object including the asset metadata and the DID
   */
  const publishNFT721 = async ({
    nftAddress,
    metadata,
    providers = undefined
  }: {
    nftAddress: string;
    metadata: MetaData;
    providers: string[] | undefined;
  }) => {
    try {
      setIsProcessing(true);

      const accountWallet = await getCurrentAccount(sdk);

      if (!account.isTokenValid()) {
        setAssetErrorMessage(
          'Your login is expired. Please first sign with your wallet and after try again'
        );
        await account.generateToken();
      }
    
      const ddo = await sdk.assets.createNft721(
        metadata,
        accountWallet,
        new AssetRewards(),
        'PSK-RSA',
        nftAddress,
        undefined,
        false,
        providers,
        0,
        undefined,
        undefined,
        ['nft721-access'],
        false,
        0
    )

      setIsProcessing(false);
      setIsPublished(true);
      setAssetMessage('The asset NFT 721 has been sucessfully published');
      setAssetErrorMessage('');
      return ddo;
    } catch (error: any) {
      Logger.error(error.message);
      setAssetErrorMessage('There was an error publishing the asset NFT 721');
      setAssetMessage('');
      setIsProcessing(false);
      throw new ClientError(error.message, 'Catalog');
    }
  };

  /**
   * In Nevermined is possible to register a digital asset that allow users pay for having a 
   * NFT (ERC-1155). This typically allows content creators to provide access to exclusive 
   * contents for NFT holders.
   * ERC-1155 NFTs are semi-fungible, meaning that a NFT can have multiple editions.
   * 
   * This method will create a new digital asset associated to a ERC-1155 NFT contract. 
   * 
   * @param metadata The metadata object describing the asset
   * @param cap The maximum number of editions that can be minted. If `0` means there is no limit (uncapped) 
   * @param royalties The amount of royalties paid back to the original creator in the secondary market
   * @param royaltyKind The royalties scheme that can be used
   * @returns The DDO object including the asset metadata and the DID
   */  
  const publishNFT1155 = async ({
    metadata,
    cap,
    royalties,
    royaltyKind
  }: {
    metadata: MetaData;
    cap: number;
    royalties: number;
    royaltyKind: RoyaltyKind;
  }) => {
    try {
      setIsProcessing(true);

      const accountWallet = await getCurrentAccount(sdk);

      const assetRewards = new AssetRewards(
        accountWallet.getId(),
        BigNumber.from(assetPublish.price)
      );
      if (!account.isTokenValid()) {
        setAssetErrorMessage(
          'Your login is expired. Please first sign with your wallet and after try again'
        );
        await account.generateToken();
      }

      const ddo = await sdk.nfts.createWithRoyalties(
        metadata,
        accountWallet,
        cap,
        royalties,
        royaltyKind,
        assetRewards
      );
      setIsProcessing(false);
      setIsPublished(true);
      setAssetMessage('The asset NFT 1155 has been sucessfully published');
      setAssetErrorMessage('');
      return ddo;
    } catch (error: any) {
      Logger.error(error.message);
      setAssetErrorMessage('There was an error publishing the asset NFT 1155');
      setAssetMessage('');
      setIsProcessing(false);
      throw new ClientError(error.message, 'Catalog');
    }
  };

  const IState = {
    errorAssetMessage,
    assetMessage,
    isPublished,
    isProcessing,
    assetPublish,
    setAssetPublish,
    setAssetMessage,
    setAssetErrorMessage,
    handleChange,
    publishAsset,
    publishNFT721,
    publishNFT1155,
    reset
  };

  return <AssetPublishContext.Provider value={IState}>{children}</AssetPublishContext.Provider>;
};

export const useAssetPublish = (): AssetPublishProviderState => useContext(AssetPublishContext);
