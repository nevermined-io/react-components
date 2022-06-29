import React from 'react';
import { Account, Config, DDO, MetaData, Nevermined, SearchQuery } from '@nevermined-io/nevermined-sdk-js';
import Catalog from '@nevermined-io/components-catalog';
import { AssetState, MintNFTInput } from '@nevermined-io/components-catalog/dist/node/types';

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
  const did = 'did:nv:f8a00c4881721f3c1c1762c280c665ee85f12265798075198129667626fad907';
  const assetData: AssetState = Catalog.useAsset(did);

  return (
    <>
      <div>Asset {did.slice(0, 10)}...:</div>
      <div>{JSON.stringify(assetData.ddo)}</div>
    </>
  );
};

const MultipleAssets = () => {
  const { isLoading: isLoadingAssets, result } = Catalog.useAssets(q);

  return (
    <>
      <div>Is Loading Assets</div>
      <div>{isLoadingAssets ? 'Yes' : 'No'}</div>
      <div>Assets:</div>
      <div>{result && JSON.stringify(result?.results)}</div>
    </>
  );
};

export interface MetaDataMain {
  name: string;
  type: 'dataset' | 'algorithm' | 'compute' | 'workflow' | 'compute';
  dateCreated: string;
  datePublished?: string;
  author: string;
  license: string;
  price: string;
  //   files?: File[];
  //   encryptedService?: any;
  //   workflow?: Workflow;
  //   algorithm?: Algorithm;
  //   service?: Service;
}

export interface _MintNFTInput {
  metadata: MetaData;
  //publisher: Account;
  cap: number;
  royalties: number;
  //assetRewards: AssetRewards;
  nftAmount?: number;
  erc20TokenAddress?: string;
  preMint?: boolean;
  nftMetadata?: string;
  //txParams?: TxParameters;
}

const MintAsset = () => {
  const { assets, sdk } = Catalog.useNevermined();
  const metadata: MetaData = {
    main: {
      name: '',
      type: 'dataset',
      author: '',
      license: '',
      dateCreated: '',
      price: ''
    }
  };

  const mint = async () => {
    try {
      const [publisher] = await sdk.accounts.list();
      const data: MintNFTInput = {
         metadata,
         publisher,
         cap,
         royalties,
         assetRewards
      } as MintNFTInput;
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

const q = {
  offset: 150,
  page: 1,
  query: {},
  sort: {
    created: 'desc'
  }
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
