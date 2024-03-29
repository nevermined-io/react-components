# Namespace: Catalog

## Table of contents

### Variables

- [NeverminedContext](Catalog.md#neverminedcontext)

### Functions

- [NeverminedProvider](Catalog.md#neverminedprovider)
- [initializeNevermined](Catalog.md#initializenevermined)
- [useNevermined](Catalog.md#usenevermined)

## Variables

### NeverminedContext

• `Const` **NeverminedContext**: `Context`<[`NeverminedProviderContext`](../interfaces/NeverminedProviderContext.md)\>

#### Defined in

[catalog.tsx:828](https://github.com/nevermined-io/components-catalog/blob/87b4993/catalog/src/catalog.tsx#L828)

## Functions

### NeverminedProvider

▸ **NeverminedProvider**(`«destructured»`): `Element`

Nevermined Provider to get the core Catalog functionalities as context

**`Example`**

Initialize NeverminedProvider:
```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Catalog } from '@nevermined-io/catalog';
import { appConfig } from './config';
import Example from 'examples';
import { MetaMask } from '@nevermined-io/providers';
import chainConfig, { mumbaiChainId } from './chain_config';

ReactDOM.render(
  <div>
    <Catalog.NeverminedProvider config={appConfig} verbose={true}>
      <WalletProvider
         client={getClient()}
      >
        <Example />
      </WalletProvider>
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

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | [`NeverminedProviderProps`](../interfaces/NeverminedProviderProps.md) |

#### Returns

`Element`

#### Defined in

[catalog.tsx:131](https://github.com/nevermined-io/components-catalog/blob/87b4993/catalog/src/catalog.tsx#L131)

___

### initializeNevermined

▸ **initializeNevermined**(`config`): `Promise`<[`GenericOutput`](../interfaces/GenericOutput.md)<`Nevermined`, `any`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | `NeverminedOptions` |

#### Returns

`Promise`<[`GenericOutput`](../interfaces/GenericOutput.md)<`Nevermined`, `any`\>\>

#### Defined in

[catalog.tsx:65](https://github.com/nevermined-io/components-catalog/blob/87b4993/catalog/src/catalog.tsx#L65)

___

### useNevermined

▸ **useNevermined**(): [`NeverminedProviderContext`](../interfaces/NeverminedProviderContext.md)

#### Returns

[`NeverminedProviderContext`](../interfaces/NeverminedProviderContext.md)

#### Defined in

[catalog.tsx:830](https://github.com/nevermined-io/components-catalog/blob/87b4993/catalog/src/catalog.tsx#L830)
