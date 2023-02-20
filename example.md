```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { WalletProvider, getClient } from "@nevermined-io/providers";
import { Catalog, AssetService, NeverminedOptions, DDO } from '@nevermined-io/catalog';
import App from 'app';

export const appConfig: NeverminedOptions = {
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
      <WalletProvider
        client={getClient()}
        correctNetworkId={80001}
        connectKitProps={
            {
                theme: 'auto',
                mode: 'dark',
            }
        }
      >
        <App />
      </WalletProvider>
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

