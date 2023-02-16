```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Config, DDO } from '@nevermined-io/sdk';
import { Catalog, AssetService } from '@nevermined-io/catalog';
import App from 'app';

export const appConfig: Config = {
  web3Provider: new Web3(window.ethereum),
  nodeUri,
  gatewayUri,
  faucetUri,
  verbose: true,
  gatewayAddress,
  secretStoreUri: '',
  graphHttpUri: '',
  marketplaceAuthToken: '',
  marketplaceUri,
  artifactsFolder: `${rootUri}/contracts`
};


const query = {
  offset: 2, // limit response to 2 items
  page: 1,
  query: {},
  sort: {
    created: -1
  }
};

const App = () => {
  const { sdk } = Catalog.useNevermined();
  const response = AssetService.useAssets(query);
  console.log(response);

  return (
    <>
      <div>Is SDK Avaialable:</div>
      <div>{Object.keys(sdk).length > 0 ? 'Yes' : 'No'}</div>
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

The NVM context exposes different modules that each compose multiple functions.
Implemented modules include subscribe, assets, account, and events. Each modules interact directly
with the sdk and exposes the functionality through the context.
For example:

```tsx
  const SingleAssetView = () => {
      const { assets, sdk } = useContext(NeverminedContext);
      const did = '123';
      const { ddo, metadata, error, isLoading, nftDetails } = assets.useAsset(did);

      return (
        ...
      )
  }
```

