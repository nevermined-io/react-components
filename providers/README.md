### Example

```typescript
import React from 'react';
import ReactDOM from 'react-dom';
import { Config, DDO } from '@nevermined-io/nevermined-sdk-js';
import Catalog from '@nevermined-io/components-catalog';
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
  const response = Catalog.useAssets(query);
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


### Project Structure

The file `src/nevermined.ts` holds the core module. in this file the sdk is initialized and the context
is exposed. The context holds the code that interacts directly with the sdk.

There is also `src/services` folder that holds the code that interacts with the context 
from `src/nevermined.ts` and introduces state management to the main functions implemented in the context.

For example, for the asset service, we have `getSingle` in the context and `useAsset` under 
`src/services/asset.ts` as a hook wrapping the `getSingle` function. 

The code that communicates directly with the sdk:

```typescript
type DID = string;

- 1 account
    getReleases(address: string) -> Promise<DID[]>
        returns assets released by address
    getCollection(address: string) -> Promise<DID[]>
        returns assets bought by address

- 2 asset
    getSingle(did: DID) -> Promise<DDO>
        returns single asset data
    getAll() -> Promise<QueryResult>
        returns all avaialble assets
    resolve(did: DID) -> Promise<DDO | undefined>
        resolves did into asset, undefined if asset not available(usually happens due to broken mint flow)
    nftDetails(did: DID) -> Promise<NFTDetails>
        return nft details

- 3 event
    accountTransferEvents(address: string) -> Promise<EventsResult>
        return user recieved transactions

- 4 subscribe
    paymentEvents(cb: (events: EventResult[]) -> void) -> ContractEventSubscribtion
        start subscribtion listening to payment events in the network
    transferEvents(cb: (events: EventResult[]) -> void) -> ContractEventSubscribtion
        start subscribtion listening to transfer events in the network
 ```       

### Services(Hooks)

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
function useSubscribeToTransferEvents(): {paymentEvents, paymentsubscription}
function useSubscribeToPaymentEvents(): {transferEvents, transferSubscription}
```

