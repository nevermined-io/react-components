import { Account, DDO, DID, MetaData, SearchQuery } from '@nevermined-io/nevermined-sdk-js';
import AssetRewards from '@nevermined-io/nevermined-sdk-js/dist/node/models/AssetRewards';
import { useNevermined } from '../contexts/NeverminedProvider';
import { BadGatewayAddressError, ERRORS } from '../errors';
import { UseAllAssetsResult, UseAssetManager } from '../types';
import { useEffect, useState } from 'react';
import { ProviderRPCError } from '../errors/index';

export const useAssetManager = (): UseAssetManager => {
  const { sdk } = useNevermined();
  const registerAsset = async (data: MetaData): Promise<DDO | any> => {
    try {
      // FIXME
      // const asset = await sdk.assets.create(data, account);
      // FIXME
      //return asset;
    } catch (e) {
      if (e instanceof Error) {
      }
    }
  };

  const registerMintableAsset = async (data: MetaData): Promise<DDO> => {
    try {
      // TODO: not implemented yet

      let erc20TokenAddress = undefined;
      const nftAmount = 1;
      const royalties = 0;

      //@ts-ignore
      const assetRewards = new AssetRewards(new Map([[account.getId(), Number(2)]]));
      const asset = await sdk.nfts.create(
        data,
        {} as Account,
        //       account,
        nftAmount,
        royalties,
        assetRewards,
        nftAmount,
        erc20TokenAddress
      );
      console.log(asset);
      return asset;
    } catch (e) {
      const err: ProviderRPCError = e as ProviderRPCError;

      if (err.code === 4001) {
        throw new ERRORS[4001](err.message);
      }
      if (err.message.startsWith('invalid address')) {
        throw new BadGatewayAddressError();
      }
    }
    const asset = await sdk.assets.create(data, {} as Account);
    return asset;
  };

  const retrieveAssetDDO = async (did: DID | string): Promise<DDO> => {
    const res = await sdk.metadata.retrieveDDO(did);
    return res;
  };

  return { retrieveAssetDDO, registerAsset, registerMintableAsset };
};

export const useAllAssets = (query = allAssetsDefaultQuery): UseAllAssetsResult => {
  const { sdk } = useNevermined();
  const [assets, setAssets] = useState<DDO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAllAssets = (query: SearchQuery) => {
    setIsLoading(true);
    sdk?.assets.query(query).then((result) => {
      setIsLoading(true);
      setAssets(result.results);
    });
  };

  useEffect(() => {
    if (!sdk?.assets) {
      return;
    }
    fetchAllAssets(query);
  }, [sdk, query]);

  return { assets, isLoading };
};

const allAssetsDefaultQuery: SearchQuery = {
  offset: 1,
  page: 1,
  query: {},
  sort: {
    created: -1
  }
};
