import { Account, DDO, DID, MetaData } from '@nevermined-io/nevermined-sdk-js';
import AssetRewards from '@nevermined-io/nevermined-sdk-js/dist/node/models/AssetRewards';
import { BadGatewayAddressError, ERRORS } from 'lib/errors';
import { useNevermined } from './NeverminedProvider';
import { ProviderRPCError } from '../errors/index';

export interface UseAssetManager {
  registerAsset: (data: MetaData) => Promise<DDO | any>;
  registerMintableAsset: (data: MetaData) => Promise<DDO>;
  retrieveAssetDDO: (did: DID | string) => Promise<DDO>;
}

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
    const asset = await sdk.assets.create(
      data,
      {} as Account
      //       account,
      // 1,
      // 0,
      // assetRewards,
      // 1,
      // erc20TokenAddress
    );
    return asset;
  };

  const retrieveAssetDDO = async (did: DID | string): Promise<DDO> => {
    const res = await sdk.metadata.retrieveDDO(did);
    return res;
  };

  return { retrieveAssetDDO, registerAsset, registerMintableAsset };
};
