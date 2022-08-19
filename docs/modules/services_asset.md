[@nevermined-io/catalog-core](../README.md) / [Modules](../modules.md) / services/asset

# Module: services/asset

## Table of contents

### Variables

- [AssetPublishContext](services_asset.md#assetpublishcontext)

### Functions

- [AssetPublishProvider](services_asset.md#assetpublishprovider)
- [useAsset](services_asset.md#useasset)
- [useAssetPublish](services_asset.md#useassetpublish)
- [useAssets](services_asset.md#useassets)

## Variables

### AssetPublishContext

• `Const` **AssetPublishContext**: `Context`<[`AssetPublishProviderState`](../interfaces/index.AssetPublishProviderState.md)\>

#### Defined in

[src/services/asset.tsx:111](https://github.com/nevermined-io/components-catalog/blob/41297c1/lib/src/services/asset.tsx#L111)

## Functions

### AssetPublishProvider

▸ **AssetPublishProvider**(`__namedParameters`): `Element`

Asset publishing helper

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.children` | `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\> |

#### Returns

`Element`

#### Defined in

[src/services/asset.tsx:116](https://github.com/nevermined-io/components-catalog/blob/41297c1/lib/src/services/asset.tsx#L116)

___

### useAsset

▸ **useAsset**(`did`): [`AssetState`](../interfaces/index.AssetState.md)

Get single asset

**`Example`**

```typescript
const MyComponent = () => {
 const did = "did";
 const { ddo } = Catalog.useAsset(did);

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

#### Returns

[`AssetState`](../interfaces/index.AssetState.md)

#### Defined in

[src/services/asset.tsx:83](https://github.com/nevermined-io/components-catalog/blob/41297c1/lib/src/services/asset.tsx#L83)

___

### useAssetPublish

▸ **useAssetPublish**(): [`AssetPublishProviderState`](../interfaces/index.AssetPublishProviderState.md)

#### Returns

[`AssetPublishProviderState`](../interfaces/index.AssetPublishProviderState.md)

#### Defined in

[src/services/asset.tsx:328](https://github.com/nevermined-io/components-catalog/blob/41297c1/lib/src/services/asset.tsx#L328)

___

### useAssets

▸ **useAssets**(`q`): `Object`

Get all assets

**`Example`**

```typescript
const MyComponent = () => {
 const {  result, isLoading } = Catalog.useAssets();

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

| Name | Type |
| :------ | :------ |
| `isLoading` | `boolean` |
| `result` | `QueryResult` |

#### Defined in

[src/services/asset.tsx:32](https://github.com/nevermined-io/components-catalog/blob/41297c1/lib/src/services/asset.tsx#L32)
