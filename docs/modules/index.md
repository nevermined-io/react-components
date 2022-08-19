[@nevermined-io/catalog-core](../README.md) / [Modules](../modules.md) / index

# Module: index

## Table of contents

### References

- [default](index.md#default)

### Enumerations

- [RoyaltyKind](../enums/index.RoyaltyKind.md)
- [State](../enums/index.State.md)

### Interfaces

- [AccountModule](../interfaces/index.AccountModule.md)
- [AssetFile](../interfaces/index.AssetFile.md)
- [AssetPublishParams](../interfaces/index.AssetPublishParams.md)
- [AssetPublishProviderState](../interfaces/index.AssetPublishProviderState.md)
- [AssetState](../interfaces/index.AssetState.md)
- [AssetsModule](../interfaces/index.AssetsModule.md)
- [ChainConfig](../interfaces/index.ChainConfig.md)
- [ContractEventSubscription](../interfaces/index.ContractEventSubscription.md)
- [CustomErc20Token](../interfaces/index.CustomErc20Token.md)
- [FileMetadata](../interfaces/index.FileMetadata.md)
- [FullfilledOrders](../interfaces/index.FullfilledOrders.md)
- [GenericOutput](../interfaces/index.GenericOutput.md)
- [MarketplaceAPIToken](../interfaces/index.MarketplaceAPIToken.md)
- [MintNFTInput](../interfaces/index.MintNFTInput.md)
- [NFTDetails](../interfaces/index.NFTDetails.md)
- [NeverminedProviderContext](../interfaces/index.NeverminedProviderContext.md)
- [NeverminedProviderProps](../interfaces/index.NeverminedProviderProps.md)
- [RegisterEvent](../interfaces/index.RegisterEvent.md)
- [SubscribeModule](../interfaces/index.SubscribeModule.md)
- [SubscriptionActions](../interfaces/index.SubscriptionActions.md)
- [Transfer](../interfaces/index.Transfer.md)
- [UserProfileParams](../interfaces/index.UserProfileParams.md)

### Type Aliases

- [DID](index.md#did)
- [EventResult](index.md#eventresult)
- [NftTypes](index.md#nfttypes)

### Variables

- [Catalog](index.md#catalog)

### Functions

- [getAgreementId](index.md#getagreementid)
- [getCurrentAccount](index.md#getcurrentaccount)
- [zeroX](index.md#zerox)

## References

### default

Renames and re-exports [Catalog](index.md#catalog)

## Type Aliases

### DID

Ƭ **DID**: `string`

Id of the asset

#### Defined in

[src/types/index.ts:387](https://github.com/nevermined-io/components-catalog/blob/41297c1/lib/src/types/index.ts#L387)

___

### EventResult

Ƭ **EventResult**: `Promise`<`any`[]\>

#### Defined in

node_modules/@nevermined-io/nevermined-sdk-js/dist/node/events/NeverminedEvent.d.ts:22

___

### NftTypes

Ƭ **NftTypes**: ``721`` \| ``1155``

#### Defined in

node_modules/@nevermined-io/nevermined-sdk-js/dist/node/gateway/Gateway.d.ts:6

## Variables

### Catalog

• `Const` **Catalog**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `AssetPublishContext` | `Context`<[`AssetPublishProviderState`](../interfaces/index.AssetPublishProviderState.md)\> |
| `AssetPublishProvider` | (`__namedParameters`: { `children`: `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\>  }) => `Element` |
| `MARKETPLACE_API_TOKEN` | ``"marketplaceApiToken"`` |
| `NeverminedContext` | `Context`<[`NeverminedProviderContext`](../interfaces/index.NeverminedProviderContext.md)\> |
| `NeverminedProvider` | (`__namedParameters`: [`NeverminedProviderProps`](../interfaces/index.NeverminedProviderProps.md)) => `Element` |
| `fetchMarketplaceApiTokenFromLocalStorage` | () => [`MarketplaceAPIToken`](../interfaces/index.MarketplaceAPIToken.md) |
| `getAssetRegisterEvent` | (`did`: `string`, `graphUrl`: `string`) => `Promise`<[`RegisterEvent`](../interfaces/index.RegisterEvent.md)[]\> |
| `getTransfers` | (`sdk`: `Nevermined`, `receiver`: `string`) => `Promise`<[`Transfer`](../interfaces/index.Transfer.md)[]\> |
| `getUserFulfilledEvents` | (`sdk`: `Nevermined`, `account`: `string`) => `Promise`<[`FullfilledOrders`](../interfaces/index.FullfilledOrders.md)[]\> |
| `getUserRegisterEvents` | (`sdk`: `Nevermined`, `owner`: `string`) => `Promise`<[`RegisterEvent`](../interfaces/index.RegisterEvent.md)[]\> |
| `initialState` | { `sdk`: `Nevermined`  } |
| `initialState.sdk` | `Nevermined` |
| `initializeNevermined` | (`config`: `Config`) => `Promise`<[`GenericOutput`](../interfaces/index.GenericOutput.md)<`Nevermined`, `any`\>\> |
| `isTokenValid` | () => `boolean` |
| `neverminedReducer` | (`state`: { `sdk`: `Nevermined`  }, `action`: { `payload`: { `sdk`: `Nevermined`  } ; `type`: ``"SET_SDK"``  }) => { `sdk`: `Nevermined`  } |
| `newMarketplaceApiToken` | (`sdk`: `Nevermined`) => `Promise`<[`MarketplaceAPIToken`](../interfaces/index.MarketplaceAPIToken.md)\> |
| `saveMarketplaceApiTokenToLocalStorage` | (`i`: [`MarketplaceAPIToken`](../interfaces/index.MarketplaceAPIToken.md)) => `void` |
| `useAccountCollection` | (`id`: `string`) => { `accountCollection`: `string`[] ; `isLoading`: `boolean`  } |
| `useAccountReleases` | (`id`: `string`) => { `accountReleases`: `string`[] ; `isLoading`: `boolean`  } |
| `useAsset` | (`did`: `string`) => [`AssetState`](../interfaces/index.AssetState.md) |
| `useAssetPublish` | () => [`AssetPublishProviderState`](../interfaces/index.AssetPublishProviderState.md) |
| `useAssets` | (`q`: `SearchQuery`) => { `isLoading`: `boolean` ; `result`: `QueryResult`  } |
| `useNevermined` | () => [`NeverminedProviderContext`](../interfaces/index.NeverminedProviderContext.md) |
| `useSubscribeToPaymentEvents` | () => { `paymentEvents`: [`EventResult`](index.md#eventresult)[]  } |
| `useSubscribeToTransferEvents` | () => { `transferEvents`: [`EventResult`](index.md#eventresult)[]  } |
| `useUserProfile` | (`walletAddress`: `string`) => { `addresses`: `string`[] ; `errorMessage`: `string` ; `inputError`: `string` ; `isAddressAdded`: `boolean` ; `isUpdated`: `boolean` ; `newAddress`: `string` ; `onAddAddress`: () => `Promise`<`void`\> ; `onSubmitUserProfile`: () => `Promise`<`void`\> ; `setUserProfile`: `Dispatch`<`SetStateAction`<`Partial`<[`UserProfileParams`](../interfaces/index.UserProfileParams.md)\>\>\> ; `successMessage`: `string` ; `userProfile`: `Partial`<[`UserProfileParams`](../interfaces/index.UserProfileParams.md)\>  } |
| `userIsNFT1155Holder` | (`did`: `string`, `walletAddress`: `string`) => { `ownNFT1155`: `boolean`  } |
| `userIsNFT721Holder` | (`did`: `string`, `nftTokenAddress`: `string`, `walletAddress`: `string`) => { `ownNFT721`: `boolean`  } |

#### Defined in

[src/index.ts:10](https://github.com/nevermined-io/components-catalog/blob/41297c1/lib/src/index.ts#L10)

## Functions

### getAgreementId

▸ **getAgreementId**(`sdk`, `template`, `did`, `account`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdk` | `Nevermined` |
| `template` | `Template` |
| `did` | `string` |
| `account` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[src/utils/index.ts:85](https://github.com/nevermined-io/components-catalog/blob/41297c1/lib/src/utils/index.ts#L85)

___

### getCurrentAccount

▸ **getCurrentAccount**(`sdk`): `Promise`<`default`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdk` | `Nevermined` |

#### Returns

`Promise`<`default`\>

#### Defined in

[src/utils/index.ts:19](https://github.com/nevermined-io/components-catalog/blob/41297c1/lib/src/utils/index.ts#L19)

___

### zeroX

▸ **zeroX**(`input`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `input` | `string` |

#### Returns

`string`

#### Defined in

node_modules/@nevermined-io/nevermined-sdk-js/dist/node/utils/ConversionTypeHelpers.d.ts:1
