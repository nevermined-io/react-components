[@nevermined-io/catalog-core](../README.md) / [Modules](../modules.md) / [index](../modules/index.md) / AssetPublishProviderState

# Interface: AssetPublishProviderState

[index](../modules/index.md).AssetPublishProviderState

Provider with all the functionalities to publish assets (no-nft, nft721, nft1155)

Here is an example how to implement it

**`See`**

[https://github.com/nevermined-io/defi-marketplace/tree/main/client/src/%2Bassets/user-publish-steps](https://github.com/nevermined-io/defi-marketplace/tree/main/client/src/%2Bassets/user-publish-steps)

## Table of contents

### Properties

- [assetMessage](index.AssetPublishProviderState.md#assetmessage)
- [assetPublish](index.AssetPublishProviderState.md#assetpublish)
- [errorAssetMessage](index.AssetPublishProviderState.md#errorassetmessage)
- [handleChange](index.AssetPublishProviderState.md#handlechange)
- [isProcessing](index.AssetPublishProviderState.md#isprocessing)
- [isPublished](index.AssetPublishProviderState.md#ispublished)
- [onAsset1155Publish](index.AssetPublishProviderState.md#onasset1155publish)
- [onAsset721Publish](index.AssetPublishProviderState.md#onasset721publish)
- [onAssetPublish](index.AssetPublishProviderState.md#onassetpublish)
- [reset](index.AssetPublishProviderState.md#reset)
- [setAssetErrorMessage](index.AssetPublishProviderState.md#setasseterrormessage)
- [setAssetMessage](index.AssetPublishProviderState.md#setassetmessage)
- [setAssetPublish](index.AssetPublishProviderState.md#setassetpublish)

## Properties

### assetMessage

• **assetMessage**: `string`

Handle publish asset message

#### Defined in

[src/types/index.ts:930](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L930)

___

### assetPublish

• **assetPublish**: [`AssetPublishParams`](index.AssetPublishParams.md)

All the parameters needed to publish an asset

#### Defined in

[src/types/index.ts:936](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L936)

___

### errorAssetMessage

• **errorAssetMessage**: `string`

Handle error publish asset message

#### Defined in

[src/types/index.ts:928](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L928)

___

### handleChange

• **handleChange**: (`value`: `string`, `input`: `string`) => `void`

#### Type declaration

▸ (`value`, `input`): `void`

Update asset parameters when some input changes

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `value` | `string` | Parameter value |
| `input` | `string` | Input where come the changes which match with the parameters |

##### Returns

`void`

#### Defined in

[src/types/index.ts:947](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L947)

___

### isProcessing

• **isProcessing**: `boolean`

If the asset is publishing

#### Defined in

[src/types/index.ts:934](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L934)

___

### isPublished

• **isPublished**: `boolean`

If the asset was published correctly

#### Defined in

[src/types/index.ts:932](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L932)

___

### onAsset1155Publish

• **onAsset1155Publish**: (`asset`: { `cap`: `number` ; `metadata`: `MetaData` ; `royalties`: `number` ; `royaltyKind`: [`RoyaltyKind`](../enums/index.RoyaltyKind.md)  }) => `Promise`<`undefined` \| `DDO`\>

#### Type declaration

▸ (`asset`): `Promise`<`undefined` \| `DDO`\>

Publish a nft1155 asset

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `asset` | `Object` |  |
| `asset.cap` | `number` | Amount of asset that is possible to mint |
| `asset.metadata` | `MetaData` | The description of the asset |
| `asset.royalties` | `number` | - |
| `asset.royaltyKind` | [`RoyaltyKind`](../enums/index.RoyaltyKind.md) | Set how the owner will receive rewards for each sale |

##### Returns

`Promise`<`undefined` \| `DDO`\>

Asset object

#### Defined in

[src/types/index.ts:978](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L978)

___

### onAsset721Publish

• **onAsset721Publish**: (`asset`: { `metadata`: `MetaData` ; `nftAddress`: `string`  }) => `Promise`<`undefined` \| `DDO`\>

#### Type declaration

▸ (`asset`): `Promise`<`undefined` \| `DDO`\>

Publish a nft721 asset

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `asset` | `Object` |  |
| `asset.metadata` | `MetaData` | The description of the asset |
| `asset.nftAddress` | `string` | nft721 token address to publish |

##### Returns

`Promise`<`undefined` \| `DDO`\>

Asset object

#### Defined in

[src/types/index.ts:964](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L964)

___

### onAssetPublish

• **onAssetPublish**: (`asset`: { `metadata`: `MetaData`  }) => `Promise`<`undefined` \| `DDO`\>

#### Type declaration

▸ (`asset`): `Promise`<`undefined` \| `DDO`\>

Publish no-nft asset

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `asset` | `Object` |  |
| `asset.metadata` | `MetaData` | The description of the asset |

##### Returns

`Promise`<`undefined` \| `DDO`\>

Asset object

#### Defined in

[src/types/index.ts:957](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L957)

___

### reset

• **reset**: (`resetAssetPublish`: [`AssetPublishParams`](index.AssetPublishParams.md)) => `void`

#### Type declaration

▸ (`resetAssetPublish`): `void`

Reset all the parameters of the asset

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `resetAssetPublish` | [`AssetPublishParams`](index.AssetPublishParams.md) | Initial parameters used for reset |

##### Returns

`void`

#### Defined in

[src/types/index.ts:951](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L951)

___

### setAssetErrorMessage

• **setAssetErrorMessage**: `Dispatch`<`SetStateAction`<`string`\>\>

Set error asset message

#### Defined in

[src/types/index.ts:942](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L942)

___

### setAssetMessage

• **setAssetMessage**: `Dispatch`<`SetStateAction`<`string`\>\>

Set asset message

#### Defined in

[src/types/index.ts:940](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L940)

___

### setAssetPublish

• **setAssetPublish**: `Dispatch`<`SetStateAction`<[`AssetPublishParams`](index.AssetPublishParams.md)\>\>

Set parameters needed to publish an asset

#### Defined in

[src/types/index.ts:938](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L938)
