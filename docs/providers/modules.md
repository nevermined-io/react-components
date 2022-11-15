# @nevermined-io/catalog-providers

## Table of contents

### Interfaces

- [WalletProviderState](interfaces/WalletProviderState.md)

### Variables

- [WalletContext](modules.md#walletcontext)

### Functions

- [ClientComp](modules.md#clientcomp)
- [WalletProvider](modules.md#walletprovider)
- [getClient](modules.md#getclient)
- [useWallet](modules.md#usewallet)
- [zeroX](modules.md#zerox)

## Variables

### WalletContext

• `Const` **WalletContext**: `Context`<[`WalletProviderState`](interfaces/WalletProviderState.md)\>

#### Defined in

[src/client.tsx:106](https://github.com/nevermined-io/components-catalog/blob/830d916/providers/src/client.tsx#L106)

## Functions

### ClientComp

▸ **ClientComp**(`__namedParameters`): `Element`

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.children` | `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\> |
| `__namedParameters.client` | `Client`<`any`, `WebSocketProvider`\> |
| `__namedParameters.correctNetworkId?` | `number` |

#### Returns

`Element`

#### Defined in

[src/client.tsx:108](https://github.com/nevermined-io/components-catalog/blob/830d916/providers/src/client.tsx#L108)

___

### WalletProvider

▸ **WalletProvider**(`config`): `Element`

This component is a layer of [Wagmi](https://wagmi.sh/docs/getting-started) and [ConnectKit](https://docs.family.co/connectkit)
which allow to handle Metamask, WalletConnect and Coinbase without needing to set any config

**`See`**

[wagmi](https://wagmi.sh/docs/getting-started)

**`Example`**

Start wallet provider example:

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Catalog } from '@nevermined-io/catalog-core';
import { appConfig } from './config';
import Example from 'examples';
import { WalletProvider, getClient } from '@nevermined-io/catalog-providers';
import chainConfig from './chain_config';

ReactDOM.render(
  <div>
    <Catalog.NeverminedProvider config={appConfig} verbose={true}>
      <WalletProvider
        client={getClient(chainConfig)}
      >
        <Example />
      </WalletProvider>
    </Catalog.NeverminedProvider>
  </div>,
  document.getElementById('root') as HTMLElement
);
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `config` | `Object` |  |
| `config.children` | `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\> | - |
| `config.client` | `Client`<`any`, `WebSocketProvider`\> | The wagmi client object |
| `config.correctNetworkId?` | `number` | Id of the default blockchain network in Hexadecimal. Default the fist chain configured |

#### Returns

`Element`

All the functionalities to handle the wallet in dapp

#### Defined in

[src/providers.tsx:41](https://github.com/nevermined-io/components-catalog/blob/830d916/providers/src/providers.tsx#L41)

___

### getClient

▸ **getClient**(`chainsConfig?`, `autoConnect?`, `appName?`): `Client`<`FallbackProvider` & {} & `JsonRpcProvider` & `FallbackProviderConfig` & {}, `WebSocketProvider`\> & {}

function that build and return the wagmi client

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `chainsConfig` | `Chain`[] | `ChainsConfig` | Config with all the available chains that can be used in the dapp. Default chains supported `Polygon Mainnet`, `Polygon Mumbai`, `spree (localhost) @param autoConnect If it is true once that the dapp start to run it will try to connect to the wallet automatically. Default `true` |
| `autoConnect` | `boolean` | `true` | - |
| `appName?` | `string` | `undefined` | App name required for Coinbase wallet. If appName is undefined Coinbase wallet won't be supported |

#### Returns

`Client`<`FallbackProvider` & {} & `JsonRpcProvider` & `FallbackProviderConfig` & {}, `WebSocketProvider`\> & {}

#### Defined in

[src/client.tsx:33](https://github.com/nevermined-io/components-catalog/blob/830d916/providers/src/client.tsx#L33)

___

### useWallet

▸ **useWallet**(): [`WalletProviderState`](interfaces/WalletProviderState.md)

#### Returns

[`WalletProviderState`](interfaces/WalletProviderState.md)

#### Defined in

[src/client.tsx:189](https://github.com/nevermined-io/components-catalog/blob/830d916/providers/src/client.tsx#L189)

___

### zeroX

▸ **zeroX**(`input?`): `string`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `input` | `string` | `""` |

#### Returns

`string`

#### Defined in

[src/utils/index.ts:1](https://github.com/nevermined-io/components-catalog/blob/830d916/providers/src/utils/index.ts#L1)
