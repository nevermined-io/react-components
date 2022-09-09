# Interface: AssetPublishProviderState

Provider with all the functionalities to publish assets (no-nft, nft721, nft1155)

## Table of contents

### Properties

- [assetMessage](AssetPublishProviderState.md#assetmessage)
- [assetPublish](AssetPublishProviderState.md#assetpublish)
- [errorAssetMessage](AssetPublishProviderState.md#errorassetmessage)
- [handleChange](AssetPublishProviderState.md#handlechange)
- [isProcessing](AssetPublishProviderState.md#isprocessing)
- [isPublished](AssetPublishProviderState.md#ispublished)
- [publishAsset](AssetPublishProviderState.md#publishasset)
- [publishNFT1155](AssetPublishProviderState.md#publishnft1155)
- [publishNFT721](AssetPublishProviderState.md#publishnft721)
- [reset](AssetPublishProviderState.md#reset)
- [setAssetMessage](AssetPublishProviderState.md#setassetmessage)
- [setAssetPublish](AssetPublishProviderState.md#setassetpublish)
- [setErrorAssetMessage](AssetPublishProviderState.md#seterrorassetmessage)

## Properties

### assetMessage

• **assetMessage**: `string`

Handle publish asset message

#### Defined in

[types/index.ts:786](https://github.com/nevermined-io/components-catalog/blob/92824c5/lib/src/types/index.ts#L786)

___

### assetPublish

• **assetPublish**: [`AssetPublishParams`](AssetPublishParams.md)

All the parameters needed to publish an asset

#### Defined in

[types/index.ts:792](https://github.com/nevermined-io/components-catalog/blob/92824c5/lib/src/types/index.ts#L792)

___

### errorAssetMessage

• **errorAssetMessage**: `string`

Handle error publish asset message

#### Defined in

[types/index.ts:784](https://github.com/nevermined-io/components-catalog/blob/92824c5/lib/src/types/index.ts#L784)

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

[types/index.ts:803](https://github.com/nevermined-io/components-catalog/blob/92824c5/lib/src/types/index.ts#L803)

___

### isProcessing

• **isProcessing**: `boolean`

If the asset is publishing

#### Defined in

[types/index.ts:790](https://github.com/nevermined-io/components-catalog/blob/92824c5/lib/src/types/index.ts#L790)

___

### isPublished

• **isPublished**: `boolean`

If the asset was published correctly

#### Defined in

[types/index.ts:788](https://github.com/nevermined-io/components-catalog/blob/92824c5/lib/src/types/index.ts#L788)

___

### publishAsset

• **publishAsset**: (`asset`: { `metadata`: `MetaData`  }) => `Promise`<`undefined` \| `DDO`\>

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

[types/index.ts:813](https://github.com/nevermined-io/components-catalog/blob/92824c5/lib/src/types/index.ts#L813)

___

### publishNFT1155

• **publishNFT1155**: (`asset`: { `cap`: `number` ; `metadata`: `MetaData` ; `royalties`: `number` ; `royaltyKind`: `RoyaltyKind`  }) => `Promise`<`undefined` \| `DDO`\>

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
| `asset.royaltyKind` | `RoyaltyKind` | Set how the owner will receive rewards for each sale |

##### Returns

`Promise`<`undefined` \| `DDO`\>

Asset object

#### Defined in

[types/index.ts:837](https://github.com/nevermined-io/components-catalog/blob/92824c5/lib/src/types/index.ts#L837)

___

### publishNFT721

• **publishNFT721**: (`asset`: { `metadata`: `MetaData` ; `nftAddress`: `string` ; `providers`: `undefined` \| `string`[]  }) => `Promise`<`undefined` \| `DDO`\>

#### Type declaration

▸ (`asset`): `Promise`<`undefined` \| `DDO`\>

Publish a nft721 asset

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `asset` | `Object` |  |
| `asset.metadata` | `MetaData` | The description of the asset |
| `asset.nftAddress` | `string` | nft721 token address to publish |
| `asset.providers` | `undefined` \| `string`[] | List of providers |

##### Returns

`Promise`<`undefined` \| `DDO`\>

Asset object

#### Defined in

[types/index.ts:821](https://github.com/nevermined-io/components-catalog/blob/92824c5/lib/src/types/index.ts#L821)

___

### reset

• **reset**: (`resetAssetPublish`: [`AssetPublishParams`](AssetPublishParams.md)) => `void`

#### Type declaration

▸ (`resetAssetPublish`): `void`

Reset all the parameters of the asset

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `resetAssetPublish` | [`AssetPublishParams`](AssetPublishParams.md) | Initial parameters used for reset |

##### Returns

`void`

#### Defined in

[types/index.ts:807](https://github.com/nevermined-io/components-catalog/blob/92824c5/lib/src/types/index.ts#L807)

___

### setAssetMessage

• **setAssetMessage**: `Dispatch`<`SetStateAction`<`string`\>\>

Set asset message

#### Defined in

[types/index.ts:796](https://github.com/nevermined-io/components-catalog/blob/92824c5/lib/src/types/index.ts#L796)

___

### setAssetPublish

• **setAssetPublish**: `Dispatch`<`SetStateAction`<[`AssetPublishParams`](AssetPublishParams.md)\>\>

Set parameters needed to publish an asset

#### Defined in

[types/index.ts:794](https://github.com/nevermined-io/components-catalog/blob/92824c5/lib/src/types/index.ts#L794)

___

### setErrorAssetMessage

• **setErrorAssetMessage**: `Dispatch`<`SetStateAction`<`string`\>\>

Set error asset message

#### Defined in

[types/index.ts:798](https://github.com/nevermined-io/components-catalog/blob/92824c5/lib/src/types/index.ts#L798)
