import { Logger, Nevermined } from '@nevermined-io/sdk'
import {
  FulfilledOrders,
  RegisterEvent,
  Transfer,
  TransferNFTConditionMethod,
  ERCType,
} from '../types'

/**
 * Get recieved transfers by address and nft type
 * @param sdk Nevermined instance
 * @param receiver Transfers receiver address
 * @param nftType Choose the NFT type. Default value 1155
 *
 * @example
 * ```tsx
 * import { Catalog, EventService } from "@nevermined-io/catalog-core";
 * import { useState } from "react";
 *
 * const MyComponent = () => {
 *  const [transfers, setTransfers] = useState<Transfer[]>([]);
 *  const { sdk } = Catalog.useNevermined();
 *
 *  useEffect(() => {
 *      const handler = async () => {
 *           const t: Transfer[] = await EventService.getTransfers(sdk, receiverAddress)
 *           setTransfers(t)
 *      }
 *  }, [receiverAddress, sdk]);
 *
 *  return (
 *   <>
 *      {transfers.map((p) => {
 *          return (
 *              <div>
 *                  <div>{p.id}</div>
 *                  <div>{p._did}</div>
 *                  <div>{p._agreementId}</div>
 *                  <div>{p._receiver}</div>
 *              </div>
 *          )
 *      })}
 *   </>
 *  )
 * }
 * ```
 */
export const getTransfers = async (
  sdk: Nevermined,
  receiver: string,
  nftType: ERCType = 1155,
): Promise<Transfer[]> => {
  try {
    const resultStruct = {
      id: true,
      _did: true,
      _agreementId: true,
      _receiver: true,
    }
    const methodName = 'getFulfilleds'
    const condition = {
      where: {
        _receiver: receiver,
      },
    }
    const data: Transfer[] = await sdk.keeper.conditions[
      nftType === 721 ? TransferNFTConditionMethod.nft721 : TransferNFTConditionMethod.nft1155
    ].events.getEventData({
      filterSubgraph: condition,
      filterJsonRpc: { _receiver: receiver },
      eventName: 'Fulfilled',
      methodName,
      result: resultStruct,
    })
    return data
  } catch (error) {
    Logger.warn('Something went wrong@getTransfers')
    Logger.debug(error)
    return []
  }
}

/**
 * Get fullfilled nft transfer events by user address
 * @param sdk - Nevermined instance
 * @param account - user address
 *
 * @example
 * ```tsx
 * import Catalog from "@nevermined-io/catalog-core";
 * import { useState } from "react";
 *
 * const MyComponent = () => {
 *  const [events, setEvents] = useState<Transfer[]>([]);
 *  const { getUserFulfilledEvents } = Catalog;
 *  const { sdk } = Catalog.useNevermined();
 *
 *  useEffect(() => {
 *      const handler = async () => {
 *           const t: Transfer[] = await getUserFulfilledEvents(sdk, receiverAddress)
 *           setTransfers(t)
 *      }
 *  }, [setEvents, sdk]);
 *
 *  return (
 *   <>
 *      {events.map((p) => {
 *          return (
 *              <div>
 *                  <div>{p.id}</div>
 *                  <div>{p._documentId}</div>
 *              </div>
 *          )
 *      })}
 *   </>
 *  )
 * }
 * ```
 */
export const getUserFulfilledEvents = async (
  sdk: Nevermined,
  account: string,
): Promise<FulfilledOrders[]> => {
  try {
    const condition = {
      where: {
        _grantee: account,
      },
    }
    const resultStruct = {
      _documentId: true,
      id: true,
    }
    const methodName = 'getFulfilleds'
    const result = await sdk.keeper.conditions.nftAccessCondition.events.getPastEvents({
      methodName,
      eventName: 'Fulfilled',
      filterSubgraph: condition,
      filterJsonRpc: { _grantee: account },
      result: resultStruct,
    })
    return result
  } catch (error) {
    Logger.warn('Something went wrong@getUserFulfilledEvents')
    Logger.debug(error)
    return []
  }
}

/**
 * Get nft creating events registered by user
 * @param sdk - Nevermined instance
 * @param owner - user address of events publisher
 *
 * @example
 * ```tsx
 * import { Catalog, EventService } from "@nevermined-io/catalog-core";
 * import { useState } from "react";
 *
 * const MyComponent = () => {
 *  const [events, setEvents] = useState<Transfer[]>([]);
 *  const { sdk } = Catalog.useNevermined();
 *
 *  useEffect(() => {
 *      const handler = async () => {
 *           const t: Transfer[] = await EventService.getUserRegisterEvents(sdk, receiverAddress)
 *           setTransfers(t)
 *      }
 *  }, [setEvents, sdk]);
 *
 *  return (
 *   <>
 *      {events.map((p) => {
 *          return (
 *              <div>
 *                  <div>{p.id}</div>
 *                  <div>{p._did}</div>
 *                  <div>{p._owner}</div>
 *                  <div>{p._lastUpdatedBy}</div>
 *                  <div>{p._blockNumberUpdated}</div>
 *              </div>
 *          )
 *      })}
 *   </>
 *  )
 * }
 * ```
 */
export const getUserRegisterEvents = async (
  sdk: Nevermined,
  owner: string,
): Promise<RegisterEvent[]> => {
  try {
    const methodName = 'getDIDAttributeRegistereds'
    const condition = {
      where: {
        _owner: owner,
      },
    }
    const resultStruct = {
      _did: true,
      _owner: true,
      _lastUpdatedBy: true,
      _blockNumberUpdated: true,
    }
    const result: RegisterEvent[] = await sdk.keeper.didRegistry.events.getPastEvents({
      methodName,
      eventName: 'DIDAttributeRegistered',
      filterSubgraph: condition,
      filterJsonRpc: { _owner: owner },
      result: resultStruct,
    })

    return result
  } catch (error) {
    Logger.warn('Something went wrong@getUserRegisterEvents')
    Logger.debug(error)
    return []
  }
}

/**
 * Get asset registering event
 * @param sdk - Nevermined instance
 * @param did - assets did
 *
 * @example
 * ```tsx
 * import { Catalog, EventService } from "@nevermined-io/catalog-core";
 * import { useState } from "react";
 *
 * const MyComponent = () => {
 *  const [events, setEvents] = useState<Transfer[]>([]);
 *  const { sdk } = Catalog.useNevermined();
 *
 *  useEffect(() => {
 *      const handler = async () => {
 *           const t: Transfer[] = await EventService.getAssetRegisterEvent(sdk, receiverAddress)
 *           setTransfers(t)
 *      }
 *  }, [setEvents, sdk]);
 *
 *  return (
 *   <>
 *      {events.map((p) => {
 *          return (
 *              <div>
 *                  <div>{p._did}</div>
 *                  <div>{p._owner}</div>
 *                  <div>{p._lastUpdatedBy}</div>
 *                  <div>{p._blockNumberUpdated}</div>
 *              </div>
 *          )
 *      })}
 *   </>
 *  )
 * }
 * ```
 */
export const getAssetRegisterEvent = async (
  sdk: Nevermined,
  did: string,
): Promise<RegisterEvent[]> => {
  try {
    const condition = {
      where: {
        _did: did,
      },
    }
    const methodName = 'getDIDAttributeRegistereds'
    const resultStruct = {
      _did: true,
      _owner: true,
      _lastUpdatedBy: true,
      _blockNumberUpdated: true,
    }
    const registerEvents: RegisterEvent[] = await sdk.keeper.didRegistry.events.getPastEvents({
      methodName,
      eventName: 'DIDAttributeRegistered',
      filterSubgraph: condition,
      filterJsonRpc: { _did: did },
      result: resultStruct,
    })
    return registerEvents // Should have length 1
  } catch (error) {
    Logger.warn('Something went wrong@getAssetRegisterEvent')
    Logger.debug(error)
    return []
  }
}
