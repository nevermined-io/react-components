[@nevermined-io/catalog-core](../README.md) / [Modules](../modules.md) / services/event

# Module: services/event

## Table of contents

### Functions

- [getAssetRegisterEvent](services_event.md#getassetregisterevent)
- [getTransfers](services_event.md#gettransfers)
- [getUserFulfilledEvents](services_event.md#getuserfulfilledevents)
- [getUserRegisterEvents](services_event.md#getuserregisterevents)

## Functions

### getAssetRegisterEvent

▸ **getAssetRegisterEvent**(`did`, `graphUrl`): `Promise`<[`RegisterEvent`](../interfaces/index.RegisterEvent.md)[]\>

Get asset registering event

**`Example`**

```tsx
import Catalog from "@nevermined-io/catalog-core";
import { useState } from "react";

const MyComponent = () => {
 const [events, setEvents] = useState<Transfer[]>([]);
 const { getAssetRegisterEvent } = Catalog;
 const { sdk } = Catalog.useNevermined();

 useEffect(() => {
     const handler = async () => {
          const t: Transfer[] = await getAssetRegisterEvent(sdk, receiverAddress)          
          setTransfers(t)
     }
 }, [setEvents, sdk]);

 return (
  <>
     {events.map((p) => {
         return (
             <div>
                 <div>{p._did}</div>
                 <div>{p._owner}</div>
                 <div>{p._lastUpdatedBy}</div>
                 <div>{p._blockNumberUpdated}</div>
             </div>
         )
     })}
  </>
 )
}
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `did` | `string` | assets did |
| `graphUrl` | `string` | - |

#### Returns

`Promise`<[`RegisterEvent`](../interfaces/index.RegisterEvent.md)[]\>

#### Defined in

[src/services/event.ts:245](https://github.com/nevermined-io/components-catalog/blob/3ad5d63/lib/src/services/event.ts#L245)

___

### getTransfers

▸ **getTransfers**(`sdk`, `receiver`): `Promise`<[`Transfer`](../interfaces/index.Transfer.md)[]\>

Get recieved transfers  by address

**`Example`**

```tsx
import Catalog from "@nevermined-io/catalog-core";
import { useState } from "react";

const MyComponent = () => {
 const [transfers, setTransfers] = useState<Transfer[]>([]);
 const { getTransfers } = Catalog;
 const { sdk } = Catalog.useNevermined();

 useEffect(() => {
     const handler = async () => {
          const t: Transfer[] = await getTransfers(sdk, receiverAddress)          
          setTransfers(t)
     }
 }, [receiverAddress, sdk]);

 return (
  <>
     {transfers.map((p) => {
         return (
             <div>
                 <div>{p.id}</div>
                 <div>{p._did}</div>
                 <div>{p._agreementId}</div>
                 <div>{p._receiver}</div>
             </div>
         )
     })}
  </>
 )
}
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sdk` | `Nevermined` | Nevermined instance |
| `receiver` | `string` | transfers receiver address |

#### Returns

`Promise`<[`Transfer`](../interfaces/index.Transfer.md)[]\>

#### Defined in

[src/services/event.ts:43](https://github.com/nevermined-io/components-catalog/blob/3ad5d63/lib/src/services/event.ts#L43)

___

### getUserFulfilledEvents

▸ **getUserFulfilledEvents**(`sdk`, `account`): `Promise`<[`FullfilledOrders`](../interfaces/index.FullfilledOrders.md)[]\>

Get fullfilled nft transfer events by user address

**`Example`**

```tsx
import Catalog from "@nevermined-io/catalog-core";
import { useState } from "react";

const MyComponent = () => {
 const [events, setEvents] = useState<Transfer[]>([]);
 const { getUserFulfilledEvents } = Catalog;
 const { sdk } = Catalog.useNevermined();

 useEffect(() => {
     const handler = async () => {
          const t: Transfer[] = await getUserFulfilledEvents(sdk, receiverAddress)          
          setTransfers(t)
     }
 }, [setEvents, sdk]);

 return (
  <>
     {events.map((p) => {
         return (
             <div>
                 <div>{p.id}</div>
                 <div>{p._documentId}</div>
             </div>
         )
     })}
  </>
 )
}
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sdk` | `Nevermined` | Nevermined instance |
| `account` | `string` | user address |

#### Returns

`Promise`<[`FullfilledOrders`](../interfaces/index.FullfilledOrders.md)[]\>

#### Defined in

[src/services/event.ts:107](https://github.com/nevermined-io/components-catalog/blob/3ad5d63/lib/src/services/event.ts#L107)

___

### getUserRegisterEvents

▸ **getUserRegisterEvents**(`sdk`, `owner`): `Promise`<[`RegisterEvent`](../interfaces/index.RegisterEvent.md)[]\>

Get nft creating events registered by user

**`Example`**

```tsx
import Catalog from "@nevermined-io/catalog-core";
import { useState } from "react";

const MyComponent = () => {
 const [events, setEvents] = useState<Transfer[]>([]);
 const { getUserRegisterEvents } = Catalog;
 const { sdk } = Catalog.useNevermined();

 useEffect(() => {
     const handler = async () => {
          const t: Transfer[] = await getUserRegisterEvents(sdk, receiverAddress)          
          setTransfers(t)
     }
 }, [setEvents, sdk]);

 return (
  <>
     {events.map((p) => {
         return (
             <div>
                 <div>{p.id}</div>
                 <div>{p._did}</div>
                 <div>{p._owner}</div>
                 <div>{p._lastUpdatedBy}</div>
                 <div>{p._blockNumberUpdated}</div>
             </div>
         )
     })}
  </>
 )
}
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sdk` | `Nevermined` | Nevermined instance |
| `owner` | `string` | user address of events publisher |

#### Returns

`Promise`<[`RegisterEvent`](../interfaces/index.RegisterEvent.md)[]\>

#### Defined in

[src/services/event.ts:175](https://github.com/nevermined-io/components-catalog/blob/3ad5d63/lib/src/services/event.ts#L175)
