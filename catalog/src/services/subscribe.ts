import { ContractEventSubscription, EventResult } from '@nevermined-io/sdk/dist/node/events'
import { useContext, useEffect, useState } from 'react'
import { NeverminedContext } from '../catalog'
import { ERCType, TransferNFTConditionMethod } from '../types'

/**
 * Subscribe to payment events
 *
 * @example
 * ```typescript
 * const MyComponent = () => {
 *  const { paymentEvents } = SubscribeService.useSubscribeToPaymentEvents();
 *
 *  return (
 *   <>
 *      {paymentEvents.map((p) => {
 *          return (
 *              <div>
 *                  <div>{p.id}</div>
 *                  <div>{p._did}</div>
 *                  <div>{p._agreementId}</div>
 *                  <div>{p._receivers}</div>
 *              </div>
 *          )
 *      })}
 *   </>
 *  )
 * }
 * ```
 * @returns Array of events with method `unsubscribe` in order to stop listening specific event
 */
export const useSubscribeToPaymentEvents = (): { paymentEvents: EventResult[] } => {
  const { sdk } = useContext(NeverminedContext)
  const [paymentSubscription, setPaymentSubscription] = useState<ContractEventSubscription>()
  const [paymentEvents, setPaymentEvents] = useState([] as EventResult[])

  useEffect(() => {
    if (sdk && sdk.keeper) {
      const paymentSubscriptionTemp = sdk.keeper.conditions.lockPaymentCondition.events.subscribe(
        (events) => {
          setPaymentEvents(events)
        },
        {
          filterSubgraph: {},
          eventName: 'Fulfilleds',
          result: {
            id: true,
            _did: true,
            _agreementId: true,
            _amounts: true,
            _receivers: true,
          },
        },
      )
      setPaymentSubscription(paymentSubscriptionTemp)
    }
    return () => paymentSubscription?.unsubscribe()
  }, [sdk])

  return { paymentEvents }
}

/**
 * Subscribe to nft transfer events
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *  const { transferEvents } = SubscribeService.useSubscribeToTransferEvents();
 *
 *  return (
 *   <>
 *      {transferEvents.map((p) => {
 *          return (
 *              <div>
 *                  <div>{p.id}</div>
 *                  <div>{p._did}</div>
 *                  <div>{p._agreementId}</div>
 *                  <div>{p._receivers}</div>
 *              </div>
 *          )
 *      })}
 *   </>
 *  )
 * }
 * ```
 * @returns Array of events with method `unsubscribe` in order to stop listening specific event
 */
export const useSubscribeToTransferEvents = (
  nftType: ERCType = 1155,
): { transferEvents: EventResult[] } => {
  const { sdk } = useContext(NeverminedContext)
  const [transferSubscription, setTransferSubscription] = useState<ContractEventSubscription>()
  const [transferEvents, setTransferEvents] = useState([] as EventResult[])

  useEffect(() => {
    if (sdk && sdk.keeper) {
      const response = sdk.keeper.conditions[
        nftType === 721 ? TransferNFTConditionMethod.nft721 : TransferNFTConditionMethod.nft1155
      ].events.subscribe(
        (events) => {
          setTransferEvents(events)
        },
        {
          filterSubgraph: {},
          eventName: 'Fulfilleds',
          result: {
            id: true,
            _did: true,
            _agreementId: true,
            _amount: true,
            _receiver: true,
          },
        },
      )
      setTransferSubscription(response)
    }

    return () => transferSubscription?.unsubscribe()
  }, [sdk])

  return { transferEvents }
}
