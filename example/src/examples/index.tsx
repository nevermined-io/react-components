import React, { useEffect } from 'react';
import Catalog from 'hello-catalog';
import { DDO } from '@nevermined-io/nevermined-sdk-js';

export const allAssetsDefaultQuery = {
  offset: 2, // limit response to 2 items
  page: 1,
  query: {},
  sort: {
    created: -1
  }
};

const App = (props: any) => {
  const { sdk } = Catalog.useNevermined();
  const { useFetchAssets, assets, isLoadingFetchAssets } = Catalog.useAssetService();
  useFetchAssets(allAssetsDefaultQuery);

  return (
    <>
      <div>Is SDK Avaialable:</div>
      <div>{Object.keys(sdk).length > 0 ? 'Yes' : 'No'}</div>
      <div>Is Loading Assets</div>
      <div>{isLoadingFetchAssets ? 'Yes' : 'No'}</div>
      <div>Assets:</div>
      <div>
        {assets?.map((asset: DDO) => (
          <div key={asset.id}>{asset.id}</div>
        ))}
      </div>
    </>
  );
};

export default App;
