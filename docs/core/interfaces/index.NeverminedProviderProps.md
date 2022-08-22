[@nevermined-io/catalog-core](../README.md) / [Modules](../modules.md) / [index](../modules/index.md) / NeverminedProviderProps

# Interface: NeverminedProviderProps

[index](../modules/index.md).NeverminedProviderProps

Nevermined Provider to get the core Catalog functionalities as context

**`Param`**

The config needed to build Nevermined SDK

**`Param`**

Show Catalog logs in console logs if it sets to `true`

**`Example`**

Initialize NeverminedProvider:
```tsx
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

- [children](index.NeverminedProviderProps.md#children)
- [config](index.NeverminedProviderProps.md#config)
- [verbose](index.NeverminedProviderProps.md#verbose)

## Properties

### children

• **children**: `any`

#### Defined in

[src/types/index.ts:369](https://github.com/nevermined-io/components-catalog/blob/f49140f/lib/src/types/index.ts#L369)

___

### config

• **config**: `Config`

#### Defined in

[src/types/index.ts:371](https://github.com/nevermined-io/components-catalog/blob/f49140f/lib/src/types/index.ts#L371)

___

### verbose

• `Optional` **verbose**: `boolean`

#### Defined in

[src/types/index.ts:370](https://github.com/nevermined-io/components-catalog/blob/f49140f/lib/src/types/index.ts#L370)
