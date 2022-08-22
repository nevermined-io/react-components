[@nevermined-io/catalog-core](../README.md) / [Modules](../modules.md) / [index](../modules/index.md) / GenericOutput

# Interface: GenericOutput<T, E\>

[index](../modules/index.md).GenericOutput

Used as a result data schema of a resolved promise

## Type parameters

| Name |
| :------ |
| `T` |
| `E` |

## Table of contents

### Properties

- [data](index.GenericOutput.md#data)
- [error](index.GenericOutput.md#error)
- [success](index.GenericOutput.md#success)

## Properties

### data

• **data**: `T`

Data from the promise

#### Defined in

[src/types/index.ts:379](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L379)

___

### error

• **error**: `E`

If the promise throw an error

#### Defined in

[src/types/index.ts:381](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L381)

___

### success

• **success**: `boolean`

If the promise resolve was success

#### Defined in

[src/types/index.ts:383](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/types/index.ts#L383)
