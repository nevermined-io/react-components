# Interface: AssetsModule

AssetsModule is exposed by the main context
under 'assets' object

## Table of contents

### Properties

- [downloadAsset](AssetsModule.md#downloadasset)
- [downloadNFT](AssetsModule.md#downloadnft)
- [findOne](AssetsModule.md#findone)
- [getCustomErc20Token](AssetsModule.md#getcustomerc20token)
- [mint](AssetsModule.md#mint)
- [nftDetails](AssetsModule.md#nftdetails)
- [orderAsset](AssetsModule.md#orderasset)
- [orderNFT1155](AssetsModule.md#ordernft1155)
- [orderNFT721](AssetsModule.md#ordernft721)
- [query](AssetsModule.md#query)
- [transfer](AssetsModule.md#transfer)
- [uploadAssetToFilecoin](AssetsModule.md#uploadassettofilecoin)

## Properties

### downloadAsset

• **downloadAsset**: (`did`: `string`) => `Promise`<`boolean`\>

#### Type declaration

▸ (`did`): `Promise`<`boolean`\>

Download an asset already ordered and transfered to the buyer,
if the user is the owner of the asset

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `did` | `string` | id of the NFT (721 & 1155) asset |

##### Returns

`Promise`<`boolean`\>

if the NFT is downloaded successfully the method will return a true

#### Defined in

[src/types/index.ts:555](https://github.com/nevermined-io/components-catalog/blob/7d68f2d/lib/src/types/index.ts#L555)

___

### downloadNFT

• **downloadNFT**: (`did`: `string`) => `Promise`<`boolean`\>

#### Type declaration

▸ (`did`): `Promise`<`boolean`\>

Download a NFT asset already ordered and transfered to the buyer,
if the user is the owner of the asset

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `did` | `string` | id of the NFT (721 & 1155) asset |

##### Returns

`Promise`<`boolean`\>

if the NFT is downloaded successfully the method will return a true

#### Defined in

[src/types/index.ts:542](https://github.com/nevermined-io/components-catalog/blob/7d68f2d/lib/src/types/index.ts#L542)

___

### findOne

• **findOne**: (`did`: `string`) => `Promise`<[`DDO`](../classes/DDO.md)\>

#### Type declaration

▸ (`did`): `Promise`<[`DDO`](../classes/DDO.md)\>

Get the asset object by the did given

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `did` | `string` | id of the asset |

##### Returns

`Promise`<[`DDO`](../classes/DDO.md)\>

#### Defined in

[src/types/index.ts:486](https://github.com/nevermined-io/components-catalog/blob/7d68f2d/lib/src/types/index.ts#L486)

___

### getCustomErc20Token

• **getCustomErc20Token**: (`customErc20TokenAddress`: `string`) => `Promise`<[`CustomErc20Token`](CustomErc20Token.md)\>

#### Type declaration

▸ (`customErc20TokenAddress`): `Promise`<[`CustomErc20Token`](CustomErc20Token.md)\>

Get all the details about a custom erc20 token

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `customErc20TokenAddress` | `string` | The custom token address |

##### Returns

`Promise`<[`CustomErc20Token`](CustomErc20Token.md)\>

Custom token details

#### Defined in

[src/types/index.ts:548](https://github.com/nevermined-io/components-catalog/blob/7d68f2d/lib/src/types/index.ts#L548)

___

### mint

• **mint**: (`did`: `any`) => `Promise`<`any`\>

#### Type declaration

▸ (`did`): `Promise`<`any`\>

Mint an asset

##### Parameters

| Name | Type |
| :------ | :------ |
| `did` | `any` |

##### Returns

`Promise`<`any`\>

If the asset was minted successfully the function will return `true`

#### Defined in

[src/types/index.ts:506](https://github.com/nevermined-io/components-catalog/blob/7d68f2d/lib/src/types/index.ts#L506)

___

### nftDetails

• **nftDetails**: (`did`: `string`) => `Promise`<[`NFTDetails`](NFTDetails.md)\>

#### Type declaration

▸ (`did`): `Promise`<[`NFTDetails`](NFTDetails.md)\>

Get the aggreement details of the NFT asset (owner, nfts supplay, royalties, etc...)

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `did` | `string` | id of the NFT (721 & 1155) asset |

##### Returns

`Promise`<[`NFTDetails`](NFTDetails.md)\>

Agreement details of the NFT asset

#### Defined in

[src/types/index.ts:512](https://github.com/nevermined-io/components-catalog/blob/7d68f2d/lib/src/types/index.ts#L512)

___

### orderAsset

• **orderAsset**: (`did`: `string`) => `Promise`<`string`\>

#### Type declaration

▸ (`did`): `Promise`<`string`\>

This method order a asset to allow after transfer to the buyer (the method only order but not transfer)

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `did` | `string` | id of the asset |

##### Returns

`Promise`<`string`\>

In case the order is completed successfully it returns the agreementId
which is needed to transfer the asset to the buyer

#### Defined in

[src/types/index.ts:519](https://github.com/nevermined-io/components-catalog/blob/7d68f2d/lib/src/types/index.ts#L519)

___

### orderNFT1155

• **orderNFT1155**: (`did`: `string`) => `Promise`<`string`\>

#### Type declaration

▸ (`did`): `Promise`<`string`\>

This method order a NFT1155 asset to allow after transfer to the buyer (the method only order but not transfer)

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `did` | `string` | id of the NFT1155 asset |

##### Returns

`Promise`<`string`\>

In case the order is completed successfully it returns the agreementId
which is needed to transfer the NFT1155 asset to the buyer

#### Defined in

[src/types/index.ts:535](https://github.com/nevermined-io/components-catalog/blob/7d68f2d/lib/src/types/index.ts#L535)

___

### orderNFT721

• **orderNFT721**: (`did`: `string`, `nftTokenAddress`: `string`) => `Promise`<`string`\>

#### Type declaration

▸ (`did`, `nftTokenAddress`): `Promise`<`string`\>

This method order a NFT721 asset to allow after transfer to the buyer (the method only order but not transfer)

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `did` | `string` | id of the NFT721 asset |
| `nftTokenAddress` | `string` | - |

##### Returns

`Promise`<`string`\>

In case the order is completed successfully it returns the agreementId
which is needed to transfer the NFT721 asset to the buyer

#### Defined in

[src/types/index.ts:527](https://github.com/nevermined-io/components-catalog/blob/7d68f2d/lib/src/types/index.ts#L527)

___

### query

• **query**: (`q`: [`SearchQuery`](SearchQuery.md)) => `Promise`<`QueryResult`\>

#### Type declaration

▸ (`q`): `Promise`<`QueryResult`\>

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `q` | [`SearchQuery`](SearchQuery.md) | Query to custom the search: order result, filtering, etc... |

##### Returns

`Promise`<`QueryResult`\>

List of assets according with the query given

#### Defined in

[src/types/index.ts:492](https://github.com/nevermined-io/components-catalog/blob/7d68f2d/lib/src/types/index.ts#L492)

___

### transfer

• **transfer**: (`assetInfo`: { `amount`: `number` ; `did`: `string`  }) => `Promise`<`boolean`\>

#### Type declaration

▸ (`assetInfo`): `Promise`<`boolean`\>

Transfer the ownership of the asset to other account

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `assetInfo` | `Object` |  |
| `assetInfo.amount` | `number` | The amount of asset to transfer |
| `assetInfo.did` | `string` | The id of the asset |

##### Returns

`Promise`<`boolean`\>

Return true if asset was transferred successfully

#### Defined in

[src/types/index.ts:500](https://github.com/nevermined-io/components-catalog/blob/7d68f2d/lib/src/types/index.ts#L500)

___

### uploadAssetToFilecoin

• **uploadAssetToFilecoin**: (`File`: `File`, `filecoinUrl`: `string`) => `Promise`<`string`\>

#### Type declaration

▸ (`File`, `filecoinUrl`): `Promise`<`string`\>

Upload files to Filecoin

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `File` | `File` | - |
| `filecoinUrl` | `string` | The url of the Filecoin server |

##### Returns

`Promise`<`string`\>

The url where is located the file already uploaded

#### Defined in

[src/types/index.ts:562](https://github.com/nevermined-io/components-catalog/blob/7d68f2d/lib/src/types/index.ts#L562)
