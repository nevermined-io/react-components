[@nevermined-io/catalog-core](README.md) / Exports

# @nevermined-io/catalog-core

## Table of contents

### Namespaces

- [AccountService](modules/AccountService.md)
- [AssetService](modules/AssetService.md)
- [AuthToken](modules/AuthToken.md)
- [Catalog](modules/Catalog.md)
- [EventService](modules/EventService.md)
- [SubscribeService](modules/SubscribeService.md)

### Enumerations

- [RoyaltyKind](enums/RoyaltyKind.md)
- [State](enums/State.md)
- [TransferNFTConditionMethod](enums/TransferNFTConditionMethod.md)

### Interfaces

- [AccountModule](interfaces/AccountModule.md)
- [AssetFile](interfaces/AssetFile.md)
- [AssetPublishParams](interfaces/AssetPublishParams.md)
- [AssetPublishProviderState](interfaces/AssetPublishProviderState.md)
- [AssetState](interfaces/AssetState.md)
- [AssetsModule](interfaces/AssetsModule.md)
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

### Functions

- [getAgreementId](modules.md#getagreementid)
- [getCurrentAccount](modules.md#getcurrentaccount)
- [zeroX](modules.md#zerox)

## Type Aliases

### DID

Ƭ **DID**: `string`

Id of the asset

#### Defined in

[src/types/index.ts:342](https://github.com/nevermined-io/components-catalog/blob/f400cb9/lib/src/types/index.ts#L342)

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

## Functions

### getAgreementId

▸ **getAgreementId**(`sdk`, `template`, `did`, `account`): `Promise`<`any`\>

Get agreement id of the asset based in the account that request it

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sdk` | `Nevermined` | Instance of SDK object |
| `template` | `Template` | The template to use according of type of asset |
| `did` | `string` | The id of the asset |
| `account` | `string` | Account user connected currently |

#### Returns

`Promise`<`any`\>

Agreement id generated after order an asset

#### Defined in

[src/utils/index.ts:111](https://github.com/nevermined-io/components-catalog/blob/f400cb9/lib/src/utils/index.ts#L111)

___

### getCurrentAccount

▸ **getCurrentAccount**(`sdk`): `Promise`<`default`\>

Returns current account registered in SDK

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sdk` | `Nevermined` | Instance of SDK object |

#### Returns

`Promise`<`default`\>

#### Defined in

[src/utils/index.ts:22](https://github.com/nevermined-io/components-catalog/blob/f400cb9/lib/src/utils/index.ts#L22)

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
