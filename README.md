# Nevermined React Library

This projects aims to provide generic React components that
connect and communicate with Nevermined.

Steps to integrate:

#### 1.
```typescript
yarn add @nevermined-io/catalog-core
or
npm install --save @nevermined-io/catalog-core
```

#### 2.
```typescript
import Catalog from '@nevermined-io/catalog-core';
import App from 'app';
import { Config } from '@nevermined-io/nevermined-sdk-js';

const appConfig: Config = {
  web3Provider: new Web3(window.ethereum),
  nodeUri,
  gatewayUri,
  faucetUri,
  verbose,
  gatewayAddress,
  secretStoreUri,
  graphHttpUri,
  marketplaceAuthToken,
  marketplaceUri,
  artifactsFolder
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
You are ready to use the catalog in your app.

```typescript
const SingleAsset = () => {
  const did = 'did:nv:f8a00...';
  const assetData: AssetState = Catalog.useAsset(did);

  return (
    <>
      <div>Asset {did}:</div>
      <div>{JSON.stringify(assetData.ddo)}</div>
    </>
  );
};

```

For an example visit example folder.
