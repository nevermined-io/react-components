[@nevermined-io/catalog-core](../README.md) / [Modules](../modules.md) / [index](../modules/index.md) / SubscribeModule

# Interface: SubscribeModule

[index](../modules/index.md).SubscribeModule

`subscribe` contains all the functionalities to handle events

**`Example`**

Subcribe payment event:

```tsx
const Example = () => {
 const { subscribe, subscription, account, isLoadingSDK} = Catalog.useNevermined();
 const { paymentEvent, setPaymentEvent } = useState<ContractEventSubscription>();

 const buy = async () => {
  if (!account.isTokenValid()) {
    await account.generateToken();
  }

  const currentAccount = await getCurrentAccount(sdk);
  const response = await subscription.buySubscription(ddo.id, currentAccount, owner, 1, 1155);
 };

 const stopLog = () => {
   paymentEvent.unsuscribe();
 }

 useEffect(() => {
   if(isLoadingSDK) {
    return;
   }
   (async () => {
     setPaymentEvent(subscribe.paymentEvents((events)=> {
       Logger.log(events)
     }))
   })()
 }, [isLoadingSDK])
 
 return (
   <div>
       <button onClick={buy} disabled={isLoadingSDK}>
         buy
       </button>
       <button onClick={stopLog} disabled={isLoadingSDK}>
         Stop the logs
       </button>
   </div>
 );
}
```

## Table of contents

### Properties

- [paymentEvents](index.SubscribeModule.md#paymentevents)
- [transferEvents](index.SubscribeModule.md#transferevents)

## Properties

### paymentEvents

• **paymentEvents**: (`cb`: (`events`: [`EventResult`](../modules/index.md#eventresult)[]) => `void`) => [`ContractEventSubscription`](index.ContractEventSubscription.md)

#### Type declaration

▸ (`cb`): [`ContractEventSubscription`](index.ContractEventSubscription.md)

Subscribe a `payment` event and execute callbacks once that this event is listened

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb` | (`events`: [`EventResult`](../modules/index.md#eventresult)[]) => `void` | Callback event |

##### Returns

[`ContractEventSubscription`](index.ContractEventSubscription.md)

return the `payment` event with a functionality to unsubscribe

#### Defined in

[src/types/index.ts:653](https://github.com/nevermined-io/components-catalog/blob/ff8bd4a/lib/src/types/index.ts#L653)

___

### transferEvents

• **transferEvents**: (`cb`: (`events`: [`EventResult`](../modules/index.md#eventresult)[]) => `void`) => [`ContractEventSubscription`](index.ContractEventSubscription.md)

#### Type declaration

▸ (`cb`): [`ContractEventSubscription`](index.ContractEventSubscription.md)

Subscribe a `transfer` event and execute callbacks once that this event is listened

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cb` | (`events`: [`EventResult`](../modules/index.md#eventresult)[]) => `void` | Callback to execute |

##### Returns

[`ContractEventSubscription`](index.ContractEventSubscription.md)

return the `transfer` event with a functionality to unsubscribe

#### Defined in

[src/types/index.ts:659](https://github.com/nevermined-io/components-catalog/blob/ff8bd4a/lib/src/types/index.ts#L659)
