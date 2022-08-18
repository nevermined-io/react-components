[@nevermined-io/catalog-core](../README.md) / [Exports](../modules.md) / NeverminedProviderProps

# Interface: NeverminedProviderProps

Nevermined Provider to get the core Catalog functionalities as context

**`Param`**

The config needed to build Nevermined SDK

**`Param`**

Show Catalog logs in console logs if it sets to `true`

**`Example`**

Initialize NeverminedProvider:
```ts
import React from 'react';
import ReactDOM from 'react-dom';
import Catalog from 'test-catalog-core';
import { appConfig } from './config';
import Example from 'examples';
import { MetaMask } from '@nevermined-io/catalog-providers';
import chainConfig, { mumbaiChainId } from './chain_config';

ReactDOM.render(
  <div>
    <Catalog.NeverminedProvider config={appConfig} verbose={true}>
      <MetaMask.WalletProvider
        externalChainConfig={chainConfig}
        correctNetworkId={mumbaiChainId}
        nodeUri={String(appConfig.nodeUri)}
      >
        <Example />
      </MetaMask.WalletProvider>
    </Catalog.NeverminedProvider>
  </div>,
  document.getElementById('root') as HTMLElement
);
```
Once it is intialized then we can execute the hook inside components

```ts
const SDKInstance = () => {
 const { sdk, isLoadingSDK } = Catalog.useNevermined();

 return (
   <>
     <div>Is Loading SDK</div>
     <div>{isLoadingSDK ? 'Yes' : 'No'}</div>
     <div>Is SDK Avaialable:</div>
     <div>{sdk && Object.keys(sdk).length > 0 ? 'Yes' : 'No'}</div>
   </>
 );
};
```

## Table of contents

### Properties

- [children](NeverminedProviderProps.md#children)
- [config](NeverminedProviderProps.md#config)
- [verbose](NeverminedProviderProps.md#verbose)

## Properties

### children

• **children**: `any`

#### Defined in

[src/types/index.ts:364](https://github.com/nevermined-io/components-catalog/blob/122c81c/lib/src/types/index.ts#L364)

___

### config

• **config**: `Config`

#### Defined in

[src/types/index.ts:366](https://github.com/nevermined-io/components-catalog/blob/122c81c/lib/src/types/index.ts#L366)

___

### verbose

• `Optional` **verbose**: `boolean`

#### Defined in

[src/types/index.ts:365](https://github.com/nevermined-io/components-catalog/blob/122c81c/lib/src/types/index.ts#L365)
