# Nevermined React Library

This projects aims to provide generic React components that
connect and communicate with Nevermined.

### Example

`
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

`
