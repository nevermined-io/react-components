import { DDO, MetaData, SearchQuery, ClientError, Logger } from '@nevermined-io/nevermined-sdk-js';
import { QueryResult } from '@nevermined-io/nevermined-sdk-js/dist/node/metadata/Metadata';
import AssetRewards from '@nevermined-io/nevermined-sdk-js/dist/node/models/AssetRewards';
import React, { useContext, useEffect, useState, createContext } from 'react';
import { NeverminedContext, useNevermined } from '../nevermined';
import { AssetState, AssetPublishParams, RoyaltyKind } from '../types';
import BigNumber from '@nevermined-io/nevermined-sdk-js/dist/node/utils/BigNumber';
import { getCurrentAccount } from '../utils';

export const useAssets = (
  q: SearchQuery
): {
  result: QueryResult;
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

export const useAsset = (did: string): AssetState => {
  const { assets } = useContext(NeverminedContext);
  const [state, setState] = useState<AssetState>({} as AssetState);

  useEffect(() => {
    const getData = async () => {
      try {
        const ddo: DDO | undefined = await assets.resolve(did);
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

export interface AssetPublishProviderState {
  errorAssetMessage: string;
  assetMessage: string;
  isPublished: boolean;
  isProcessing: boolean;
  assetPublish: AssetPublishParams;
  setAssetPublish: React.Dispatch<React.SetStateAction<AssetPublishParams>>;
  setAssetMessage: React.Dispatch<React.SetStateAction<string>>;
  setAssetErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  handleChange: (value: string, input: string) => void;
  reset: (resetAssetPublish: AssetPublishParams) => void;
  onAssetPublish: ({ metadata }: { metadata: MetaData }) => Promise<DDO | undefined>;
  onAsset721Publish: ({
    nftAddress,
    metadata
  }: {
    nftAddress: string;
    metadata: MetaData;
  }) => Promise<DDO | undefined>;
  onAsset1155Publish: ({
    metadata,
    cap,
    royalties,
    royaltyKind
  }: {
    metadata: MetaData;
    cap: number;
    royalties: number;
    royaltyKind: RoyaltyKind;
  }) => Promise<DDO | undefined>;
}

export const AssetPublishContext = createContext({} as AssetPublishProviderState);

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
  const onAssetPublish = async ({ metadata }: { metadata: MetaData }) => {
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
   * @returns The DDO object including the asset metadata and the DID
   */
  const onAsset721Publish = async ({
    nftAddress,
    metadata
  }: {
    nftAddress: string;
    metadata: MetaData;
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
        undefined,
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
  const onAsset1155Publish = async ({
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
    onAssetPublish,
    onAsset721Publish,
    onAsset1155Publish,
    reset
  };

  return <AssetPublishContext.Provider value={IState}>{children}</AssetPublishContext.Provider>;
};

export const useAssetPublish = (): AssetPublishProviderState => useContext(AssetPublishContext);
