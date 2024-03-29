# Namespace: AssetService

## Table of contents

### Variables

- [AssetPublishContext](AssetService.md#assetpublishcontext)

### Functions

- [AssetPublishProvider](AssetService.md#assetpublishprovider)
- [useAsset](AssetService.md#useasset)
- [useAssetPublish](AssetService.md#useassetpublish)
- [useAssets](AssetService.md#useassets)

## Variables

### AssetPublishContext

• `Const` **AssetPublishContext**: `Context`<[`AssetPublishProviderState`](../interfaces/AssetPublishProviderState.md)\>

#### Defined in

[services/asset.tsx:128](https://github.com/nevermined-io/components-catalog/blob/87b4993/catalog/src/services/asset.tsx#L128)

## Functions

### AssetPublishProvider

▸ **AssetPublishProvider**(`«destructured»`): `Element`

Provider with all the functionalities to publish assets (no-nft, nft721, nft1155)

Here is an example how to implement it

**`See`**

[https://github.com/nevermined-io/defi-marketplace/tree/main/client/src/%2Bassets/user-publish-steps](https://github.com/nevermined-io/defi-marketplace/tree/main/client/src/%2Bassets/user-publish-steps)

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `children` | `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\> |

#### Returns

`Element`

#### Defined in

[services/asset.tsx:136](https://github.com/nevermined-io/components-catalog/blob/87b4993/catalog/src/services/asset.tsx#L136)

___

### useAsset

▸ **useAsset**(`did`, `ercType`): [`AssetState`](../interfaces/AssetState.md)

Get single asset

**`Example`**

```tsx
const MyComponent = () => {
 const did = "did";
 const { ddo } = AssetService.useAsset(did);

 return (
  <>
    {JSON.stringify(ddo)}
  </>
 )
}
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `did` | `string` | asset did |
| `ercType` | `ERCType` | - |

#### Returns

[`AssetState`](../interfaces/AssetState.md)

#### Defined in

[services/asset.tsx:100](https://github.com/nevermined-io/components-catalog/blob/87b4993/catalog/src/services/asset.tsx#L100)

___

### useAssetPublish

▸ **useAssetPublish**(): [`AssetPublishProviderState`](../interfaces/AssetPublishProviderState.md)

#### Returns

[`AssetPublishProviderState`](../interfaces/AssetPublishProviderState.md)

#### Defined in

[services/asset.tsx:417](https://github.com/nevermined-io/components-catalog/blob/87b4993/catalog/src/services/asset.tsx#L417)

___

### useAssets

▸ **useAssets**(`q`): `Object`

Get all assets

**`Example`**

```tsx
const MyComponent = () => {
 const {  result, isLoading } = AssetService.useAssets();

 return (
  <>
     {result.results.map((d: DDO) => {
         return (
             <div>
             {JSON.stringify(d)}
             </div>
         )
     })}
  </>
 )
}
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `q` | `SearchQuery` | assets query |

#### Returns

`Object`

| Name | Type | Description |
| :------ | :------ | :------ |
| `isLoading` | `boolean` | If the query is still processing |
| `result` | `QueryResult` | Result based in the query search requested |

#### Defined in

[services/asset.tsx:47](https://github.com/nevermined-io/components-catalog/blob/87b4993/catalog/src/services/asset.tsx#L47)
