/**
 * @module AssetRegistrationProvider
 */

import { DDO, DID, MetaData } from '@nevermined-io/nevermined-sdk-js';
import AssetRewards from '@nevermined-io/nevermined-sdk-js/dist/node/models/AssetRewards';
import { BadGatewayAddressError, ERRORS } from 'lib/errors';
import React, { createContext, useContext, useEffect, useState } from 'react';

import { useNevermined } from './NeverminedProvider';
import { ProviderRPCError } from '../errors/index';

interface AssetRegistrationProviderValue {
  registerAsset(data: MetaData): Promise<DDO>;
  registerMintableAsset(): Promise<DDO>;
  retrieveAssetDDO(did: DID | string): Promise<DDO>;
  isPublishing: boolean;
  hasFinishedPublishing: boolean;
  hasPublishingError: boolean;
  publishingError: any;
}

const AssetRegistrationContext = createContext({} as AssetRegistrationProviderValue);
export const AssetRegistrationProvider = ({
  children
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const {
    sdk,
    user: { account }
  } = useNevermined();

  const [isPublishing, setIsPublishing] = useState(false);
  const [hasFinishedPublishing, setHasFinishedPublishing] = useState(false);
  const [hasPublishingError, setHasPublishingError] = useState(false);
  const [publishingError, setPublishingError] = useState<any>(null);

  useEffect(() => {
    // * simple method to reset error state for now
    if (hasFinishedPublishing) {
      if (hasPublishingError) {
        setTimeout(() => {
          setPublishingError(null);
          setHasFinishedPublishing(false);
          setIsPublishing(false);
        }, 5000);
      }
    }
  }, [hasFinishedPublishing, hasPublishingError]);

  const registerAsset = async (data: MetaData): Promise<DDO | any> => {
    try {
      setIsPublishing(true);
      setHasFinishedPublishing(false);

      const asset = await sdk.assets.create(data, account);

      setIsPublishing(false);
      setHasFinishedPublishing(true);

      return asset;
    } catch (e) {
      if (e instanceof Error) {
        setPublishingError(e.message);
        setHasPublishingError(true);
        setIsPublishing(false);
        setHasFinishedPublishing(true);
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
        account,
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
      account
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

  return (
    <AssetRegistrationContext.Provider
      value={
        {
          registerAsset,
          registerMintableAsset,
          retrieveAssetDDO,
          isPublishing,
          hasFinishedPublishing,
          hasPublishingError,
          publishingError
        } as AssetRegistrationProviderValue
      }
    >
      {children}
    </AssetRegistrationContext.Provider>
  );
};

export const useAssetRegistration = (): AssetRegistrationProviderValue =>
  useContext(AssetRegistrationContext);
export default AssetRegistrationProvider;
