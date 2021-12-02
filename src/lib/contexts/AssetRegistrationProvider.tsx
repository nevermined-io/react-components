import { DDO, DID, MetaData } from '@nevermined-io/nevermined-sdk-js';
import React, { createContext, useContext } from 'react';
import { useNevermined } from './NeverminedProvider';

interface AssetRegistrationProviderValue {
  registerAsset(data: MetaData): Promise<DDO>;
  registerMintableAsset(): Promise<DDO>;
  retrieveAssetDDO(did: DID | string): Promise<DDO>;
}

const AssetRegistrationContext = createContext({} as AssetRegistrationProviderValue);
const AssetRegistrationProvider = ({
  children
}: {
  children: React.ReactNode;
}): React.ReactElement => {
  const {
    sdk,
    user: { account }
  } = useNevermined();

  const registerAsset = async (data: MetaData): Promise<DDO> => {
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

  const registerMintableAsset = async (data: MetaData): Promise<DDO> => {
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
          retrieveAssetDDO
        } as AssetRegistrationProviderValue
      }
    >
      {children}
    </AssetRegistrationContext.Provider>
  );
};

const useAssetRegistration = (): AssetRegistrationProviderValue =>
  useContext(AssetRegistrationContext);
export { useAssetRegistration, AssetRegistrationContext };
export default AssetRegistrationProvider;
