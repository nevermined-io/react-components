import { DDO, MetaData, SearchQuery } from '@nevermined-io/nevermined-sdk-js';
import { QueryResult } from '@nevermined-io/nevermined-sdk-js/dist/node/metadata/Metadata';
import AssetRewards from '@nevermined-io/nevermined-sdk-js/dist/node/models/AssetRewards';
import React, { useContext, useEffect, useState, createContext } from 'react';
import { NeverminedContext, useNevermined } from '../nevermined';
import {
  AssetState,
  AssetPublishParams,
} from '../types';
import BigNumber from 'bignumber.js';
import { useGetAccount } from './account'
import { getCurrentAccount } from '../utils'

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
    } catch (error) {
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
        console.error(e as Error);
      }
    };
    getData();
  }, [did, assets]);

  return { ...state };
};

export interface AssetPublishProviderState {
  errorAssetMessage: string,
  assetMessage: string,
  isPublished: boolean,
  isProcessing: boolean,
  assetPublish: AssetPublishParams,
  setAssetPublish: React.Dispatch<React.SetStateAction<AssetPublishParams>>,
  setAssetMessage: React.Dispatch<React.SetStateAction<string>>,
  setAssetErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  handleChange: (value: string, input: string) => void,
  reset: (resetAssetPublish: AssetPublishParams) => void,
  onAssetPublish: ({ nftAddress, metadata }: {
    nftAddress: string;
    metadata: MetaData,
  }) => Promise<DDO | undefined>
}

export const AssetPublishContext = createContext({} as AssetPublishProviderState);

export const AssetPublishProvider = ({ children }: { 
  children: React.ReactElement
}) => {
  const { sdk, account, config } = useNevermined();
  const { walletAccount } = useGetAccount()
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
    asset_files: []
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

  const onAssetPublish = async ({ nftAddress, metadata }: { nftAddress: string, metadata: MetaData }) => {
    try {
      setIsProcessing(true)

      const accountWallet = await getCurrentAccount(sdk);

      const assetRewards = new AssetRewards(accountWallet.getId(), new BigNumber(assetPublish.price));
      if (!account.isTokenValid()) {
        setAssetErrorMessage(
          'Your login is expired. Please first sign with your wallet and after try again'
        );
        await account.generateToken();
      }

      const ddo = await sdk.nfts.create721(metadata, walletAccount, assetRewards, nftAddress);
      setIsProcessing(false);
      setIsPublished(true);
      setAssetMessage('The assets has been sucessfully published. DID: ' + ddo.id);
      setAssetErrorMessage('');
      return ddo;
    } catch (error: any) {
      console.error(error.message);
      setAssetErrorMessage('There was an error publishing the Asset');
      setAssetMessage('');
      setIsProcessing(false);
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
    reset,
  };

  return (<AssetPublishContext.Provider value={IState}>{children}</AssetPublishContext.Provider>)
};

export const useAssetPublish = (): AssetPublishProviderState => useContext(AssetPublishContext);