import AssetRewards from '@nevermined-io/nevermined-sdk-js/dist/node/models/AssetRewards';
import React, { useEffect, useState } from 'react';
import { MetaData, Logger, DDO } from '@nevermined-io/nevermined-sdk-js';
import BigNumber from '@nevermined-io/nevermined-sdk-js/dist/node/utils/BigNumber';
import Catalog, { MintNFTInput } from 'test-catalog-core';
import {getCurrentAccount} from 'test-catalog-core/dist/node/utils'
import { MetaMask } from '@nevermined-io/catalog-providers';

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

const SingleAsset = ({ddo}: {ddo: DDO}) => {

  return (
    <>
      <div>Asset {ddo.id.slice(0, 10)}...:</div>
      <div>{JSON.stringify(ddo)}</div>
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
      rewardMap.set(recipient.walletAddress, BigNumber.from(+ownSplit));
      totalWithoutUser += recipient.split;
    }
  });

  if (!rewardMap.has(ownerWalletAddress)) {
    const ownSplitReinforced = +((priceWithoutFee * (100 - totalWithoutUser)) / 100).toFixed();
    rewardMap.set(ownerWalletAddress, BigNumber.from(ownSplitReinforced));
  }

  return rewardMap;
};

const MintAsset = ({onMint}: {onMint: () => void}) => {
  const { assets } = Catalog.useNevermined();

  return (
    <>
      <button onClick={onMint} disabled={!Object.keys(assets).length}>
        mint
      </button>
    </>
  );
};

const BuyAsset = ({ddo}: {ddo: DDO}) => {
  const { assets, account, isLoadingSDK, subscription, sdk } = Catalog.useNevermined();
  const { walletAddress } = MetaMask.useWallet();
  const [ownNFT1155, setOwnNFT1155] = useState(false);
  const [isBought, setIsBought] = useState(false);
  const owner = ddo.proof.creator;
  
  useEffect(() => {
    (async () => {
      const response = await account.isNFT1155Holder(ddo.id, walletAddress);
      setOwnNFT1155(response);
    })()
  }, [walletAddress, isBought])


  const buy = async () => {
    if (!account.isTokenValid()) {
      await account.generateToken();
    }

    const currentAccount = await getCurrentAccount(sdk);
    const response = await subscription.buySubscription(ddo.id, currentAccount, owner, 1, 1155);
    setIsBought(response);
  };

  const download = async () => {
    await assets.downloadNFT(ddo.id);
  };

  return (
    <div>
      {ownNFT1155 ? (
        <button onClick={download} disabled={isLoadingSDK}>
          Download NFT
        </button>
      ) : (
        owner !== walletAddress ?
        <button onClick={buy} disabled={isLoadingSDK}>
          buy
        </button>
        : <span>The owner cannot buy, please change the account to buy the NFT asset</span>
      )}
    </div>
  );
};

const MMWallet = () => {
  const { loginMetamask, walletAddress } = MetaMask.useWallet();
  return (
    <>
      <div> {walletAddress}</div>
      {!walletAddress && <button onClick={loginMetamask}>Connect To MM</button>}
    </>
  );
};

const App = () => {
  const { isLoadingSDK, sdk, account, assets } = Catalog.useNevermined();
  const [ddo, setDDO] = useState<DDO>({} as DDO)
  Logger.setLevel(3);

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
      const publisher = await getCurrentAccount(sdk);
      const rewardsRecipients: any[] = [];
      const assetRewardsMap = constructRewardMap(rewardsRecipients, 100, publisher.getId());
      const assetRewards = new AssetRewards(assetRewardsMap);
      const data: MintNFTInput = {
        metadata,
        publisher,
        cap: 100,
        royalties: 0,
        nftAmount: 1,
        preMint: true,
        erc20TokenAddress: '0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e',
        //@ts-ignore
        assetRewards
      };
      if (!account.isTokenValid()) {
        await account.generateToken();
      }
      const response = await assets.mint(data);
      setDDO(response);
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <>
      <SDKInstance />
      {!isLoadingSDK && (
        <>
          <MintAsset onMint={mint} />
        </>
      )}
      <MMWallet />
      {ddo?.proof?.creator && 
        <>
          <SingleAsset ddo={ddo}/>
          <BuyAsset ddo={ddo}/>
        </>  
      }
      
    </>
  );
};

export default App;
