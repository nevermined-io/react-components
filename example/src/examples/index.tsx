import BigNumber from 'bignumber.js';
import AssetRewards from '@nevermined-io/nevermined-sdk-js/dist/node/models/AssetRewards';
import React from 'react';
import { DDO, MetaData } from '@nevermined-io/nevermined-sdk-js';
import Catalog from 'hello-catalog';
import { AssetState, MintNFTInput } from 'hello-catalog/dist/node/types';

const SDKInstance = () => {
  const { sdk, isLoadingSDK } = Catalog.useNevermined();

  return (
    <>
      <div>Is Loading SDK</div>
      <div>{isLoadingSDK ? 'Yes' : 'No'}</div>
      <div>Is SDK Avaialable:</div>
      <div>{sdk && Object.keys(sdk).length > 0 ? 'Yes' : 'No'}</div>
    </>
  );
};

const SingleAsset = () => {
  const did = 'did:nv:25881196c2a72c1d76bc82d81b9d9fd12f6b1705ebb8174d80840ee1d8eb3c00';
  const assetData: AssetState = Catalog.useAsset(did);

  return (
    <>
      <div>Asset {did.slice(0, 10)}...:</div>
      <div>{JSON.stringify(assetData.ddo)}</div>
    </>
  );
};

const useAssetsQuery = {
  offset: 150,
  page: 1,
  query: {},
  sort: {
    created: 'desc'
  }
};

export const MultipleAssets = () => {
  const { isLoading: isLoadingAssets, result } = Catalog.useAssets(useAssetsQuery);

  return (
    <>
      <div>Is Loading Assets</div>
      <div>{isLoadingAssets ? 'Yes' : 'No'}</div>
      <div>Assets:</div>
      <div>{result && JSON.stringify(result?.results)}</div>
    </>
  );
};

const constructRewardMap = (
  recipientsData: any[],
  priceWithoutFee: number,
  ownerWalletAddress: string
): Map<string, BigNumber> => {
  const rewardMap: Map<string, BigNumber> = new Map();
  let recipients: any = [];
  if (recipientsData.length === 1 && recipientsData[0].split === 0) {
    recipients = [
      {
        name: ownerWalletAddress,
        split: 100,
        walletAddress: ownerWalletAddress
      }
    ];
  }
  let totalWithoutUser = 0;

  recipients.forEach((recipient: any) => {
    if (recipient.split && recipient.split > 0) {
      const ownSplit = ((priceWithoutFee * recipient.split) / 100).toFixed();
      rewardMap.set(recipient.walletAddress, new BigNumber(+ownSplit));
      totalWithoutUser += recipient.split;
    }
  });

  if (!rewardMap.has(ownerWalletAddress)) {
    const ownSplitReinforced = +((priceWithoutFee * (100 - totalWithoutUser)) / 100).toFixed();
    rewardMap.set(ownerWalletAddress, new BigNumber(ownSplitReinforced));
  }

  return rewardMap;
};

const MintAsset = () => {
  const { assets, sdk, account } = Catalog.useNevermined();
  const metadata: MetaData = {
    main: {
      name: '',
      files: [],
      type: 'dataset',
      author: '',
      license: '',
      dateCreated: new Date().toISOString(),
      price: ''
    }
  };

  const mint = async () => {
    try {
      const [publisher] = await sdk.accounts.list();
      const rewardsRecipients: any[] = [];
      const assetRewardsMap = constructRewardMap(rewardsRecipients, 100, publisher.getId());
      const assetRewards = new AssetRewards(assetRewardsMap);
      const data: MintNFTInput = {
        metadata,
        publisher,
        cap: 1,
        royalties: 0,
        //@ts-ignore
        assetRewards
      };
      if (!account.isTokenValid()) {
        await account.generateToken();
      }
      const response = await assets.mint(data);
      console.log('response', response);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <>
      <button onClick={mint} disabled={!Object.keys(assets).length}>
        mint
      </button>
    </>
  );
};

const TransferAsset = () => {
  const { assets, account } = Catalog.useNevermined();

  const transfer = async () => {
    try {
      if (!account.isTokenValid()) {
        await account.generateToken();
      }
      const did = 'did:nv:25881196c2a72c1d76bc82d81b9d9fd12f6b1705ebb8174d80840ee1d8eb3c00';
      const input: { did: string; amount: number } = {
        did,
        amount: 1
      };
      const response = await assets.transfer(input);
      console.log('response', response);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <>
      <button onClick={transfer} disabled={!Object.keys(assets).length}>
        transfer
      </button>
    </>
  );
};

const App = (props: any) => {
  return (
    <>
      <SDKInstance />
      <MintAsset />
      {/**<MultipleAssets />**/}
      <SingleAsset />
    </>
  );
};

export default App;
