[@nevermined-io/catalog-core](../README.md) / [Modules](../modules.md) / [index](../modules/index.md) / AccountModule

# Interface: AccountModule

[index](../modules/index.md).AccountModule

AccountModule is exposed by the main context
under 'account' object

## Table of contents

### Properties

- [generateToken](index.AccountModule.md#generatetoken)
- [getCollection](index.AccountModule.md#getcollection)
- [getReleases](index.AccountModule.md#getreleases)
- [isNFT1155Holder](index.AccountModule.md#isnft1155holder)
- [isNFT721Holder](index.AccountModule.md#isnft721holder)
- [isTokenValid](index.AccountModule.md#istokenvalid)

## Properties

### generateToken

• **generateToken**: () => `Promise`<[`MarketplaceAPIToken`](index.MarketplaceAPIToken.md)\>

#### Type declaration

▸ (): `Promise`<[`MarketplaceAPIToken`](index.MarketplaceAPIToken.md)\>

Generate a token for authentication in the Marketplace API

##### Returns

`Promise`<[`MarketplaceAPIToken`](index.MarketplaceAPIToken.md)\>

The new generated token

#### Defined in

[src/types/index.ts:477](https://github.com/nevermined-io/components-catalog/blob/f49140f/lib/src/types/index.ts#L477)

___

### getCollection

• **getCollection**: (`address`: `string`) => `Promise`<`string`[]\>

#### Type declaration

▸ (`address`): `Promise`<`string`[]\>

Get the assets bought by the address given

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The address which bought the assets returned |

##### Returns

`Promise`<`string`[]\>

List of assets which was bought by the address given as argument

#### Defined in

[src/types/index.ts:472](https://github.com/nevermined-io/components-catalog/blob/f49140f/lib/src/types/index.ts#L472)

___

### getReleases

• **getReleases**: (`address`: `string`) => `Promise`<`string`[]\>

#### Type declaration

▸ (`address`): `Promise`<`string`[]\>

Get all the assets published from the address passed by argument

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `address` | `string` | The address owner of the assets that we want to get |

##### Returns

`Promise`<`string`[]\>

List of assets which was published by the address given

#### Defined in

[src/types/index.ts:466](https://github.com/nevermined-io/components-catalog/blob/f49140f/lib/src/types/index.ts#L466)

___

### isNFT1155Holder

• **isNFT1155Holder**: (`did`: `string`, `walletAddress`: `string`) => `Promise`<`boolean`\>

#### Type declaration

▸ (`did`, `walletAddress`): `Promise`<`boolean`\>

This method validates if a user is a NFT (ERC-1155 based) holder for a specific `tokenId`.
For ERC-1155 tokens, we use the DID as tokenId. A user can between zero an multiple editions
of a NFT (limitted by the NFT cap).

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `did` | `string` | The unique identifier of the NFT within a NFT ERC-1155 contract |
| `walletAddress` | `string` | The public address of the user |

##### Returns

`Promise`<`boolean`\>

true if the user owns at least one edition of the NFT

#### Defined in

[src/types/index.ts:492](https://github.com/nevermined-io/components-catalog/blob/f49140f/lib/src/types/index.ts#L492)

___

### isNFT721Holder

• **isNFT721Holder**: (`did`: `string`, `nftTokenAddress`: `string`, `walletAddress`: `string`) => `Promise`<`boolean`\>

#### Type declaration

▸ (`did`, `nftTokenAddress`, `walletAddress`): `Promise`<`boolean`\>

This method validates if a user is a NFT (ERC-721 based) holder for a specific NFT contract address.
For ERC-721 tokens, we use the DID as tokenId. A user can between zero an multiple editions
of a NFT (limitted by the NFT cap).

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `did` | `string` | - |
| `nftTokenAddress` | `string` | - |
| `walletAddress` | `string` | The public address of the user |

##### Returns

`Promise`<`boolean`\>

true if the user holds the NFT

#### Defined in

[src/types/index.ts:502](https://github.com/nevermined-io/components-catalog/blob/f49140f/lib/src/types/index.ts#L502)

___

### isTokenValid

• **isTokenValid**: () => `boolean`

#### Type declaration

▸ (): `boolean`

check if the token for Marketplace API is valid

##### Returns

`boolean`

if token is valid it will return true

#### Defined in

[src/types/index.ts:482](https://github.com/nevermined-io/components-catalog/blob/f49140f/lib/src/types/index.ts#L482)
