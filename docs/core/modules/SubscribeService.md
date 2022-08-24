[@nevermined-io/catalog-core](../README.md) / [Exports](../modules.md) / SubscribeService

# Namespace: SubscribeService

## Table of contents

### Functions

- [useSubscribeToPaymentEvents](SubscribeService.md#usesubscribetopaymentevents)
- [useSubscribeToTransferEvents](SubscribeService.md#usesubscribetotransferevents)

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
| `paymentEvents` | [`EventResult`](../modules.md#eventresult)[] |

#### Defined in

[src/services/subscribe.ts:33](https://github.com/nevermined-io/components-catalog/blob/9dc93ea/lib/src/services/subscribe.ts#L33)

___

### useSubscribeToTransferEvents

▸ **useSubscribeToTransferEvents**(): `Object`

Subscribe to nft transfer events

**`Example`**

```tsx
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
| `transferEvents` | [`EventResult`](../modules.md#eventresult)[] |

#### Defined in

[src/services/subscribe.ts:89](https://github.com/nevermined-io/components-catalog/blob/9dc93ea/lib/src/services/subscribe.ts#L89)
