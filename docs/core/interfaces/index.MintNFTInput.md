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

[src/types/index.ts:692](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L692)

___

### cap

• **cap**: `number`

The maximum of assets that can be minted

#### Defined in

[src/types/index.ts:688](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L688)

___

### erc20TokenAddress

• `Optional` **erc20TokenAddress**: `string`

The erc20 token address which the buyer will pay the price

#### Defined in

[src/types/index.ts:696](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L696)

___

### metadata

• **metadata**: `MetaData`

MetaData object which contain all the parameters that describes the asset

#### Defined in

[src/types/index.ts:684](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L684)

___

### nftAmount

• `Optional` **nftAmount**: `number`

The amount of NFTs that an address needs to hold in order to access the DID's protected assets. Leave it undefined and it will default to 1.

#### Defined in

[src/types/index.ts:694](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L694)

___

### nftMetadata

• `Optional` **nftMetadata**: `string`

url to set at publishing time that resolves to the metadata of the nft as expected by opensea

**`See`**

[https://docs.opensea.io/docs/metadata-standards](https://docs.opensea.io/docs/metadata-standards)

#### Defined in

[src/types/index.ts:702](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L702)

___

### preMint

• `Optional` **preMint**: `boolean`

If assets are minted in the creation process

#### Defined in

[src/types/index.ts:698](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L698)

___

### publisher

• **publisher**: `default`

The Publisher account of the asset

#### Defined in

[src/types/index.ts:686](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L686)

___

### royalties

• **royalties**: `number`

The profit that the publisher get for every sale

#### Defined in

[src/types/index.ts:690](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L690)

___

### txParams

• `Optional` **txParams**: `TxParameters`

Trasaction number of the asset creation

#### Defined in

[src/types/index.ts:704](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L704)
