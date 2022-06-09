import React from 'react';
import Catalog from '@nevermined-io/components-catalog';
import { CollectionItem } from '@nevermined-io/components-catalog/dist/node/types';

const App = (props: any) => {
  const { sdk, isLoadingSDK } = Catalog.useNevermined();
  const { isLoading: isLoadingAssets, allArtwork } = Catalog.useAllAssets();

  return (
    <>
      <div>Is Loading SDK</div>
      <div>{isLoadingSDK ? 'Yes' : 'No'}</div>
      <div>Is SDK Avaialable:</div>
      <div>{sdk && Object.keys(sdk).length > 0 ? 'Yes' : 'No'}</div>
      <div>Is Loading Assets</div>
      <div>{isLoadingAssets ? 'Yes' : 'No'}</div>
      <div>Assets:</div>
      <div>
        {allArtwork?.map((asset: CollectionItem) => (
          <div key={asset.artwork.id}>{asset.artwork.id}</div>
        ))}
      </div>
    </>
  );
};

export default App;
