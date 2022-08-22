[@nevermined-io/catalog-core](../README.md) / [Modules](../modules.md) / services/subscribe

# Module: services/subscribe

## Table of contents

### Functions

- [useSubscribeToPaymentEvents](services_subscribe.md#usesubscribetopaymentevents)
- [useSubscribeToTransferEvents](services_subscribe.md#usesubscribetotransferevents)

## Functions

### useSubscribeToPaymentEvents

▸ **useSubscribeToPaymentEvents**(): `Object`

Subscribe to payment events

**`Example`**

```typescript
const MyComponent = () => {
 const { paymentEvents } = useSubscribeToPaymentEvents();

 return (
  <>
     {paymentEvents.map((p) => {
         return (
             <div>
                 <div>{p.id}</div>
                 <div>{p._did}</div>
                 <div>{p._agreementId}</div>
                 <div>{p._receivers}</div>
             </div>
         )
     })}
  </>
 )
}
```

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `paymentEvents` | [`EventResult`](index.md#eventresult)[] |

#### Defined in

[src/services/subscribe.ts:33](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/services/subscribe.ts#L33)

___

### useSubscribeToTransferEvents

▸ **useSubscribeToTransferEvents**(): `Object`

Subscribe to nft transfer events

**`Example`**

```typescript
const MyComponent = () => {
 const { transferEvents } = useSubscribeToTransferEvents();

 return (
  <>
     {transferEvents.map((p) => {
         return (
             <div>
                 <div>{p.id}</div>
                 <div>{p._did}</div>
                 <div>{p._agreementId}</div>
                 <div>{p._receivers}</div>
             </div>
         )
     })}
  </>
 )
}
```

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `transferEvents` | [`EventResult`](index.md#eventresult)[] |

#### Defined in

[src/services/subscribe.ts:89](https://github.com/nevermined-io/components-catalog/blob/885bfce/lib/src/services/subscribe.ts#L89)
