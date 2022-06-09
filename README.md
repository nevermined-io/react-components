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
### Project Structure

The file `src/nevermined.ts` holds the core module. in this file the sdk is initialized and the context
is exposed. The context holds the code that interacts directly with the sdk.

There is also `src/services` folder that holds the code that interacts with the context 
from `src/nevermined.ts` and introduces state management to the main functions implemented in the context.

For example, for the asset service, we have `getSingle` in the context and `useAsset` under 
`src/services/UseAssetService.ts` as a hook wrapping the `getSingle` function. 

The code that communicates directly with the sdk from the context:

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
