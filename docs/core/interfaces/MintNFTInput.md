# Interface: MintNFTInput

Mint NFT input interface

## Table of contents

### Properties

- [assetRewards](MintNFTInput.md#assetrewards)
- [cap](MintNFTInput.md#cap)
- [erc20TokenAddress](MintNFTInput.md#erc20tokenaddress)
- [metadata](MintNFTInput.md#metadata)
- [nftAmount](MintNFTInput.md#nftamount)
- [nftMetadata](MintNFTInput.md#nftmetadata)
- [preMint](MintNFTInput.md#premint)
- [publisher](MintNFTInput.md#publisher)
- [royalties](MintNFTInput.md#royalties)
- [txParams](MintNFTInput.md#txparams)

## Properties

### assetRewards

• **assetRewards**: `default`

The price of the asset

#### Defined in

[src/types/index.ts:659](https://github.com/nevermined-io/components-catalog/blob/7d68f2d/lib/src/types/index.ts#L659)

___

### cap

• **cap**: `number`

The maximum of assets that can be minted

#### Defined in

[src/types/index.ts:655](https://github.com/nevermined-io/components-catalog/blob/7d68f2d/lib/src/types/index.ts#L655)

___

### erc20TokenAddress

• `Optional` **erc20TokenAddress**: `string`

The erc20 token address which the buyer will pay the price

#### Defined in

[src/types/index.ts:663](https://github.com/nevermined-io/components-catalog/blob/7d68f2d/lib/src/types/index.ts#L663)

___

### metadata

• **metadata**: [`MetaData`](MetaData.md)

MetaData object which contain all the parameters that describes the asset

#### Defined in

[src/types/index.ts:651](https://github.com/nevermined-io/components-catalog/blob/7d68f2d/lib/src/types/index.ts#L651)

___

### nftAmount

• `Optional` **nftAmount**: `number`

The amount of NFTs that an address needs to hold in order to access the DID's protected assets. Leave it undefined and it will default to 1.

#### Defined in

[src/types/index.ts:661](https://github.com/nevermined-io/components-catalog/blob/7d68f2d/lib/src/types/index.ts#L661)

___

### nftMetadata

• `Optional` **nftMetadata**: `string`

url to set at publishing time that resolves to the metadata of the nft as expected by opensea

**`See`**

[https://docs.opensea.io/docs/metadata-standards](https://docs.opensea.io/docs/metadata-standards)

#### Defined in

[src/types/index.ts:669](https://github.com/nevermined-io/components-catalog/blob/7d68f2d/lib/src/types/index.ts#L669)

___

### preMint

• `Optional` **preMint**: `boolean`

If assets are minted in the creation process

#### Defined in

[src/types/index.ts:665](https://github.com/nevermined-io/components-catalog/blob/7d68f2d/lib/src/types/index.ts#L665)

___

### publisher

• **publisher**: [`Account`](../classes/Account.md)

The Publisher account of the asset

#### Defined in

[src/types/index.ts:653](https://github.com/nevermined-io/components-catalog/blob/7d68f2d/lib/src/types/index.ts#L653)

___

### royalties

• **royalties**: `number`

The profit that the publisher get for every sale

#### Defined in

[src/types/index.ts:657](https://github.com/nevermined-io/components-catalog/blob/7d68f2d/lib/src/types/index.ts#L657)

___

### txParams

• `Optional` **txParams**: `TxParameters`

Trasaction number of the asset creation

#### Defined in

[src/types/index.ts:671](https://github.com/nevermined-io/components-catalog/blob/7d68f2d/lib/src/types/index.ts#L671)
