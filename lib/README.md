# Nevermined React Library

This projects aims to provide generic React components that
connect and communicate with Nevermined.

### Example

```typescript
import React from 'react';
import ReactDOM from 'react-dom';
import { Config, DDO } from '@nevermined-io/nevermined-sdk-js';
import Catalog from '@nevermined-io/components-catalog';
import App from 'app';

const metadataUri = 'https://metadata.autonomies.staging.nevermined.rocks';
const gatewayAddress = '0xe63a11dC61b117D9c2B1Ac8021d4cffEd8EC213b';
const gatewayUri = 'https://gateway.autonomies.staging.nevermined.rocks';
const faucetUri = 'https://faucet.autonomies.staging.nevermined.rocks';
const nodeUri = 'https://polygon-mumbai.infura.io/v3/eda048626e2745b182f43de61ac70be1';

const appConfig = {
  metadataUri,
  gatewayUri,
  faucetUri,
  nodeUri,
  gatewayAddress,
  verbose: true
} as Config;

const assetsQuery = {
  offset: 2, // limit response to 2 items
  page: 1,
  query: {},
  sort: {
    created: -1
  }
};

const App = () => {
  const { sdk } = Catalog.useNevermined();
  const { useFetchAssets, assets, isLoadingFetchAssets } = Catalog.useAssetService();
  useFetchAssets(assetsQuery);

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
Current implemented modules are subscribe, assets, account, and events. Each
one of these modules interact directly  with the sdk and exposes the functionality through the context.
For example:

```typescript
  const SingleAssetView = () => {
      const { assets, sdk } = useContext(NeverminedContext);
      const did = '123';
      const { ddo, metadata, error, isLoading, nftDetails } = assets.useAsset(did);

      return (
        ...
      )
  }
```


### Plug and Play Services

These services use the core functions mentioned above, but with state management capabilities.
Example: If u need to fetch account releases u can use useAccountReleases(see Account Service section), its built using the assets module
exposed from the sdk context.

#### Account Service

```typescript
function useAccountReleases(id: string): {isLoading: boolean; accountReleases: string[]}
A hook to return user releases dids in array.

function useAccountCollection(id: string): {isLoading: boolean; accountCollection: string[]}
A hook to return user collection dids in array.
```

#### Asset Service

```typescript
function useAssets(q: SearchQuery): {isLoading: boolean, result: QueryResult}
A hook to query assets with specific query.

function useAsset(did: string): AssetState
A hook to fetch single asset by did.
```

#### Event Service

```typescript
function usePaymentEvents(): {paymentEvents: EventResult[], isLoading: boolean}
A hook to fetch fulfilled payment events.

function useUserTransferEvents(id: string): {transferEvents: EventResult[], isLoading: boolean}
A hook to fetch fulfilled user transfer events.
```

#### Subscribe Service

```typescript
useSubscribeToTransferEvents(): {paymentEvents, paymentsubscription}
useSubscribeToPaymentEvents(): {transferEvents, transferSubscription}
```
