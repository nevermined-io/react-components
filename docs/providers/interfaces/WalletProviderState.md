# Interface: WalletProviderState

This component is a layer of [Wagmi](https://wagmi.sh/docs/getting-started) and [ConnectKit](https://docs.family.co/connectkit)
which allow to handle Metamask, WalletConnect and Coinbase without needing to set any config

## Table of contents

### Properties

- [checkIsChainCorrect](WalletProviderState.md#checkischaincorrect)
- [client](WalletProviderState.md#client)
- [getAllAvailableChains](WalletProviderState.md#getallavailablechains)
- [getProvider](WalletProviderState.md#getprovider)
- [getStatus](WalletProviderState.md#getstatus)
- [login](WalletProviderState.md#login)
- [logout](WalletProviderState.md#logout)
- [walletAddress](WalletProviderState.md#walletaddress)

## Properties

### checkIsChainCorrect

• **checkIsChainCorrect**: () => `boolean`

#### Type declaration

▸ (): `boolean`

If chain is between the available networks supported

##### Returns

`boolean`

#### Defined in

[src/client.tsx:92](https://github.com/nevermined-io/components-catalog/blob/95bbb52/providers/src/client.tsx#L92)

___

### client

• **client**: `Client`<`Provider`, `WebSocketProvider`\>

All the wagmi client functionalities

**`See`**

[wagmi](https://wagmi.sh/docs/getting-started)

#### Defined in

[src/client.tsx:78](https://github.com/nevermined-io/components-catalog/blob/95bbb52/providers/src/client.tsx#L78)

___

### getAllAvailableChains

• **getAllAvailableChains**: () => `Chain`[]

#### Type declaration

▸ (): `Chain`[]

Get all the available chains

##### Returns

`Chain`[]

#### Defined in

[src/client.tsx:86](https://github.com/nevermined-io/components-catalog/blob/95bbb52/providers/src/client.tsx#L86)

___

### getProvider

• **getProvider**: () => `Provider`

#### Type declaration

▸ (): `Provider`

Metamask provider for example web3 or ethers

##### Returns

`Provider`

#### Defined in

[src/client.tsx:80](https://github.com/nevermined-io/components-catalog/blob/95bbb52/providers/src/client.tsx#L80)

___

### getStatus

• **getStatus**: () => `undefined` \| ``"connecting"`` \| ``"connected"`` \| ``"reconnecting"`` \| ``"disconnected"``

#### Type declaration

▸ (): `undefined` \| ``"connecting"`` \| ``"connected"`` \| ``"reconnecting"`` \| ``"disconnected"``

Get the status of the wallet

##### Returns

`undefined` \| ``"connecting"`` \| ``"connected"`` \| ``"reconnecting"`` \| ``"disconnected"``

#### Defined in

[src/client.tsx:84](https://github.com/nevermined-io/components-catalog/blob/95bbb52/providers/src/client.tsx#L84)

___

### login

• **login**: () => `undefined` \| `Promise`<`Required`<`ConnectorData`<`any`\>\>\>

#### Type declaration

▸ (): `undefined` \| `Promise`<`Required`<`ConnectorData`<`any`\>\>\>

Login in Provider

##### Returns

`undefined` \| `Promise`<`Required`<`ConnectorData`<`any`\>\>\>

#### Defined in

[src/client.tsx:90](https://github.com/nevermined-io/components-catalog/blob/95bbb52/providers/src/client.tsx#L90)

___

### logout

• **logout**: () => `void`

#### Type declaration

▸ (): `void`

Logout from the wallet

##### Returns

`void`

#### Defined in

[src/client.tsx:82](https://github.com/nevermined-io/components-catalog/blob/95bbb52/providers/src/client.tsx#L82)

___

### walletAddress

• **walletAddress**: `string`

The address of the wallet account

#### Defined in

[src/client.tsx:88](https://github.com/nevermined-io/components-catalog/blob/95bbb52/providers/src/client.tsx#L88)
