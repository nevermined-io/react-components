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

[src/types/index.ts:335](https://github.com/nevermined-io/components-catalog/blob/7d68f2d/lib/src/types/index.ts#L335)

___

### error

• **error**: `E`

If the promise throw an error

#### Defined in

[src/types/index.ts:337](https://github.com/nevermined-io/components-catalog/blob/7d68f2d/lib/src/types/index.ts#L337)

___

### success

• **success**: `boolean`

If the promise resolve was success

#### Defined in

[src/types/index.ts:339](https://github.com/nevermined-io/components-catalog/blob/7d68f2d/lib/src/types/index.ts#L339)
