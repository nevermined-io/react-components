[![banner](https://raw.githubusercontent.com/nevermined-io/assets/main/images/logo/banner_logo.png)](https://nevermined.io)

# Nevermined Catalog of Components

> The framework for building React applications using Nevermined
> [nevermined.io](https://nevermined.io)

[![Tests](https://github.com/nevermined-io/components-catalog/actions/workflows/testing.yml/badge.svg)](https://github.com/nevermined-io/components-catalog/actions/workflows/testing.yml)
[![NPM Release](https://github.com/nevermined-io/components-catalog/actions/workflows/release-npm.yml/badge.svg)](https://github.com/nevermined-io/components-catalog/actions/workflows/release-npm.yml)

---

## Table of Contents

* [Nevermined Catalog of Components](#nevermined-catalog-of-components)
   * [Table of Contents](#table-of-contents)
   * [What components are avaliable into the catalog?](#what-components-are-avaliable-into-the-catalog)
   * [How can I use it?](#how-can-i-use-it)
      * [First: Add the NPM dependency to your project](#first-add-the-npm-dependency-to-your-project)
      * [Second: Integrate it in your code](#second-integrate-it-in-your-code)
   * [Demo and examples](#demo-and-examples)
   * [Advanced documentation](#advanced-documentation)
* [License](#license)

---

The Nevermined Catalog is a library of packaged Nevermined functionalities making easier to add web3 capabilities to any existing React application.


## What components are avaliable into the catalog?

Some of the main functionalities that can be found in the catalog are:

* Registering an asset with a NFT attached to it
* Purchase of NFTs
* Data Sharing
* Minting and burning NFTs
* Exclusive access exclusive contents for NFT holders
* etc

You can find a full list of all the existing components into the [Components section of the Functionalities page](docs/functionalities.md).

## How can I use it?

Steps to integrate:

### First: Add the NPM dependency to your project

```typescript
yarn add @nevermined-io/catalog-core
or
npm install --save @nevermined-io/catalog-core
```

### Second: Integrate it in your code

```typescript
import { Catalog } from '@nevermined-io/catalog-core';
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
  const assetData: AssetState = AssetService.useAsset(did);

  return (
    <>
      <div>Asset {did}:</div>
      <div>{JSON.stringify(assetData.ddo)}</div>
    </>
  );
};

```


## Demo and examples

You can find more information in the [examples page](docs/examples.md).

## Advanced documentation

To find additional options and documentation you can visit the [advanced documentation page](docs/advanced.md) or the [providers page](docs/providers.md) to understand how to integrate the catalog with different providers like Metamask.


# License

```
Copyright 2022 Nevermined AG
This product includes software developed at
BigchainDB GmbH and Ocean Protocol (https://www.oceanprotocol.com/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```



