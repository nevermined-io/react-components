[@nevermined-io/catalog-core](../README.md) / [Modules](../modules.md) / [index](../modules/index.md) / MintNFTInput

# Interface: MintNFTInput

[index](../modules/index.md).MintNFTInput

Mint NFT input interface

## Table of contents

### Properties

- [assetRewards](index.MintNFTInput.md#assetrewards)
- [cap](index.MintNFTInput.md#cap)
- [erc20TokenAddress](index.MintNFTInput.md#erc20tokenaddress)
- [metadata](index.MintNFTInput.md#metadata)
- [nftAmount](index.MintNFTInput.md#nftamount)
- [nftMetadata](index.MintNFTInput.md#nftmetadata)
- [preMint](index.MintNFTInput.md#premint)
- [publisher](index.MintNFTInput.md#publisher)
- [royalties](index.MintNFTInput.md#royalties)
- [txParams](index.MintNFTInput.md#txparams)

## Properties

### assetRewards

• **assetRewards**: `default`

The price of the asset

#### Defined in

[src/types/index.ts:693](https://github.com/nevermined-io/components-catalog/blob/3ad5d63/lib/src/types/index.ts#L693)

___

### cap

• **cap**: `number`

The maximum of assets that can be minted

#### Defined in

[src/types/index.ts:689](https://github.com/nevermined-io/components-catalog/blob/3ad5d63/lib/src/types/index.ts#L689)

___

### erc20TokenAddress

• `Optional` **erc20TokenAddress**: `string`

The erc20 token address which the buyer will pay the price

#### Defined in

[src/types/index.ts:697](https://github.com/nevermined-io/components-catalog/blob/3ad5d63/lib/src/types/index.ts#L697)

___

### metadata

• **metadata**: `MetaData`

MetaData object which contain all the parameters that describes the asset

#### Defined in

[src/types/index.ts:685](https://github.com/nevermined-io/components-catalog/blob/3ad5d63/lib/src/types/index.ts#L685)

___

### nftAmount

• `Optional` **nftAmount**: `number`

The amount of NFTs that an address needs to hold in order to access the DID's protected assets. Leave it undefined and it will default to 1.

#### Defined in

[src/types/index.ts:695](https://github.com/nevermined-io/components-catalog/blob/3ad5d63/lib/src/types/index.ts#L695)

___

### nftMetadata

• `Optional` **nftMetadata**: `string`

url to set at publishing time that resolves to the metadata of the nft as expected by opensea

**`See`**

[https://docs.opensea.io/docs/metadata-standards](https://docs.opensea.io/docs/metadata-standards)

#### Defined in

[src/types/index.ts:703](https://github.com/nevermined-io/components-catalog/blob/3ad5d63/lib/src/types/index.ts#L703)

___

### preMint

• `Optional` **preMint**: `boolean`

If assets are minted in the creation process

#### Defined in

[src/types/index.ts:699](https://github.com/nevermined-io/components-catalog/blob/3ad5d63/lib/src/types/index.ts#L699)

___

### publisher

• **publisher**: `default`

The Publisher account of the asset

#### Defined in

[src/types/index.ts:687](https://github.com/nevermined-io/components-catalog/blob/3ad5d63/lib/src/types/index.ts#L687)

___

### royalties

• **royalties**: `number`

The profit that the publisher get for every sale

#### Defined in

[src/types/index.ts:691](https://github.com/nevermined-io/components-catalog/blob/3ad5d63/lib/src/types/index.ts#L691)

___

### txParams

• `Optional` **txParams**: `TxParameters`

Trasaction number of the asset creation

#### Defined in

[src/types/index.ts:705](https://github.com/nevermined-io/components-catalog/blob/3ad5d63/lib/src/types/index.ts#L705)
