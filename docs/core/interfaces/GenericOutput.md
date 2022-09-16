# Interface: GenericOutput<T, E\>

Used as a result data schema of a resolved promise

## Type parameters

| Name |
| :------ |
| `T` |
| `E` |

## Table of contents

### Properties

- [data](GenericOutput.md#data)
- [error](GenericOutput.md#error)
- [success](GenericOutput.md#success)

## Properties

### data

• **data**: `T`

Data from the promise

#### Defined in

[types/index.ts:342](https://github.com/nevermined-io/components-catalog/blob/89449f9/lib/src/types/index.ts#L342)

___

### error

• **error**: `E`

If the promise throw an error

#### Defined in

[types/index.ts:344](https://github.com/nevermined-io/components-catalog/blob/89449f9/lib/src/types/index.ts#L344)

___

### success

• **success**: `boolean`

If the promise resolve was success

#### Defined in

[types/index.ts:346](https://github.com/nevermined-io/components-catalog/blob/89449f9/lib/src/types/index.ts#L346)
