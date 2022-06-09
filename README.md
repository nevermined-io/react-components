# Nevermined React Library

This projects aims to provide generic React components that
connect and communicate with Nevermined.

### Example

```typescript
import React from 'react';
import ReactDOM from 'react-dom';
import { Config } from '@nevermined-io/nevermined-sdk-js';
import Catalog from '@nevermined-io/components-catalog';
import { CollectionItem } from '@nevermined-io/components-catalog/dist/node/types';
import App from 'app';

const metadataUri = 'https://metadata.autonomies.staging.nevermined.rocks';
const gatewayAddress = '0xe63a11dC61b117D9c2B1Ac8021d4cffEd8EC213b';
const gatewayUri = 'https://gateway.autonomies.staging.nevermined.rocks';
const faucetUri = 'https://faucet.autonomies.staging.nevermined.rocks';
const nodeUri = 'https://polygon-mumbai.infura.io/v3/eda048626e2745b182f43de61ac70be1';

const appConfig = {
    web3Provider: new Web3(window.ethereum),
    nodeUri,
    metadataUri,
    gatewayUri,
    faucetUri,
    verbose: true,
    gatewayAddress,
    secretStoreUri: "",
    graphHttpUri: ""
} as Config;

const App = () => {
  const { sdk, isLoadingSDK } = Catalog.useNevermined();
  const { isLoading: isLoadingAssets, allArtwork } = Catalog.useAllAssets();

  return (
    <>
      <div>Is Loading SDK:</div>
      <div>{isLoadingSDK ? 'Yes' : 'No'}</div>
      <div>Is SDK Avaialable:</div>
      <div>{sdk && Object.keys(sdk).length > 0 ? 'Yes' : 'No'}</div>
      <div>Is Loading Assets</div>
      <div>{isLoadingFetchAssets ? 'Yes' : 'No'}</div>
      <div>Assets:</div>
      <div>
        {allArtwork?.map((asset: CollectionItem) => (
          <div key={asset.artwork.id}>{asset.artwork.id}</div>
        ))}
      </div>
    </>
  );
};

ReactDOM.render(
  <div>
    <Catalog.NeverminedProvider config={appConfig}>
      <App />
    </Catalog.NeverminedProvider>
  </div>,
  document.getElementById('root') as HTMLElement
);
```

