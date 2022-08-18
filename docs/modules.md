[@nevermined-io/catalog-core](README.md) / Exports

# @nevermined-io/catalog-core

## Table of contents

### References

- [default](modules.md#default)

### Enumerations

- [RoyaltyKind](enums/RoyaltyKind.md)
- [State](enums/State.md)

### Interfaces

- [AccountModule](interfaces/AccountModule.md)
- [AssetFile](interfaces/AssetFile.md)
- [AssetPublishParams](interfaces/AssetPublishParams.md)
- [AssetState](interfaces/AssetState.md)
- [AssetsModule](interfaces/AssetsModule.md)
- [ChainConfig](interfaces/ChainConfig.md)
- [ContractEventSubscription](interfaces/ContractEventSubscription.md)
- [CustomErc20Token](interfaces/CustomErc20Token.md)
- [FileMetadata](interfaces/FileMetadata.md)
- [FullfilledOrders](interfaces/FullfilledOrders.md)
- [GenericOutput](interfaces/GenericOutput.md)
- [MarketplaceAPIToken](interfaces/MarketplaceAPIToken.md)
- [MintNFTInput](interfaces/MintNFTInput.md)
- [NFTDetails](interfaces/NFTDetails.md)
- [NeverminedProviderContext](interfaces/NeverminedProviderContext.md)
- [NeverminedProviderProps](interfaces/NeverminedProviderProps.md)
- [RegisterEvent](interfaces/RegisterEvent.md)
- [SubscribeModule](interfaces/SubscribeModule.md)
- [SubscriptionActions](interfaces/SubscriptionActions.md)
- [Transfer](interfaces/Transfer.md)
- [UserProfileParams](interfaces/UserProfileParams.md)

### Type Aliases

- [DID](modules.md#did)
- [EventResult](modules.md#eventresult)
- [NftTypes](modules.md#nfttypes)

### Variables

- [Catalog](modules.md#catalog)

### Functions

- [getAgreementId](modules.md#getagreementid)
- [getCurrentAccount](modules.md#getcurrentaccount)

## References

### default

Renames and re-exports [Catalog](modules.md#catalog)

## Type Aliases

### DID

Ƭ **DID**: `string`

#### Defined in

[src/types/index.ts:375](https://github.com/nevermined-io/components-catalog/blob/122c81c/lib/src/types/index.ts#L375)

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
| `AssetPublishContext` | `Context`<`AssetPublishProviderState`\> |
| `AssetPublishProvider` | (`__namedParameters`: { `children`: `ReactElement`<`any`, `string` \| `JSXElementConstructor`<`any`\>\>  }) => `Element` |
| `MARKETPLACE_API_TOKEN` | ``"marketplaceApiToken"`` |
| `NeverminedContext` | `Context`<[`NeverminedProviderContext`](interfaces/NeverminedProviderContext.md)\> |
| `NeverminedProvider` | (`__namedParameters`: [`NeverminedProviderProps`](interfaces/NeverminedProviderProps.md)) => `Element` |
| `fetchMarketplaceApiTokenFromLocalStorage` | () => [`MarketplaceAPIToken`](interfaces/MarketplaceAPIToken.md) |
| `getAssetRegisterEvent` | (`asset`: `string`, `graphUrl`: `string`) => `Promise`<[`RegisterEvent`](interfaces/RegisterEvent.md)[]\> |
| `getTransfers` | (`sdk`: `Nevermined`, `receiver`: `string`) => `Promise`<[`Transfer`](interfaces/Transfer.md)[]\> |
| `getUserFulfilledEvents` | (`sdk`: `Nevermined`, `account`: `string`) => `Promise`<[`FullfilledOrders`](interfaces/FullfilledOrders.md)[]\> |
| `getUserRegisterEvents` | (`sdk`: `Nevermined`, `owner`: `string`) => `Promise`<[`RegisterEvent`](interfaces/RegisterEvent.md)[]\> |
| `initialState` | { `sdk`: `Nevermined`  } |
| `initialState.sdk` | `Nevermined` |
| `initializeNevermined` | (`config`: `Config`) => `Promise`<[`GenericOutput`](interfaces/GenericOutput.md)<`Nevermined`, `any`\>\> |
| `isTokenValid` | () => `boolean` |
| `neverminedReducer` | (`state`: { `sdk`: `Nevermined`  }, `action`: { `payload`: { `sdk`: `Nevermined`  } ; `type`: ``"SET_SDK"``  }) => { `sdk`: `Nevermined`  } |
| `newMarketplaceApiToken` | (`sdk`: `Nevermined`) => `Promise`<[`MarketplaceAPIToken`](interfaces/MarketplaceAPIToken.md)\> |
| `saveMarketplaceApiTokenToLocalStorage` | (`i`: [`MarketplaceAPIToken`](interfaces/MarketplaceAPIToken.md)) => `void` |
| `useAccountCollection` | (`id`: `string`, `format`: (`dids`: `string`[]) => `any`) => { `accountCollection`: `string`[] ; `isLoading`: `boolean`  } |
| `useAccountReleases` | (`id`: `string`, `format?`: (`dids`: `string`[]) => `any`) => { `accountReleases`: `string`[] ; `isLoading`: `boolean`  } |
| `useAsset` | (`did`: `string`) => [`AssetState`](interfaces/AssetState.md) |
| `useAssetPublish` | () => `AssetPublishProviderState` |
| `useAssets` | (`q`: `SearchQuery`) => { `isLoading`: `boolean` ; `result`: `QueryResult`  } |
| `useNevermined` | () => [`NeverminedProviderContext`](interfaces/NeverminedProviderContext.md) |
| `useSubscribeToPaymentEvents` | () => () => { `paymentEvents`: [`EventResult`](modules.md#eventresult)[] ; `paymentSubscription`: `undefined` \| [`ContractEventSubscription`](interfaces/ContractEventSubscription.md)  } |
| `useSubscribeToTransferEvents` | () => () => { `transferEvents`: [`EventResult`](modules.md#eventresult)[] ; `transferSubscription`: `undefined` \| [`ContractEventSubscription`](interfaces/ContractEventSubscription.md)  } |
| `useUserProfile` | (`walletAddress`: `string`) => { `addresses`: `string`[] ; `errorMessage`: `string` ; `inputError`: `string` ; `isAddressAdded`: `boolean` ; `isUpdated`: `boolean` ; `newAddress`: `string` ; `onAddAddress`: () => `Promise`<`void`\> ; `onSubmitUserProfile`: () => `Promise`<`void`\> ; `setUserProfile`: `Dispatch`<`SetStateAction`<`Partial`<[`UserProfileParams`](interfaces/UserProfileParams.md)\>\>\> ; `successMessage`: `string` ; `userProfile`: `Partial`<[`UserProfileParams`](interfaces/UserProfileParams.md)\>  } |
| `userIsNFT1155Holder` | (`did`: `string`, `walletAddress`: `string`) => { `ownNFT1155`: `boolean`  } |
| `userIsNFT721Holder` | (`did`: `string`, `nftTokenAddress`: `string`, `walletAddress`: `string`) => { `ownNFT721`: `boolean`  } |

#### Defined in

[src/index.ts:10](https://github.com/nevermined-io/components-catalog/blob/122c81c/lib/src/index.ts#L10)

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

[src/utils/index.ts:77](https://github.com/nevermined-io/components-catalog/blob/122c81c/lib/src/utils/index.ts#L77)

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

[src/utils/index.ts:11](https://github.com/nevermined-io/components-catalog/blob/122c81c/lib/src/utils/index.ts#L11)
