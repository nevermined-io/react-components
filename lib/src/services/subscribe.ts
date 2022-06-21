import { Nevermined } from '@nevermined-io/nevermined-sdk-js';
import {
  ContractEventSubscription,
  EventResult
} from '@nevermined-io/nevermined-sdk-js/dist/node/events';
import { useContext, useEffect, useState } from 'react';
import { NeverminedContext } from '../nevermined';

export const useSubscribeToPaymentEvents = () => () => {
  const { sdk } = useContext(NeverminedContext);
  const [paymentSubscription, setPaymentSubscription] = useState<ContractEventSubscription>();
  const [paymentEvents, setPaymentEvents] = useState([] as EventResult[]);

  useEffect(() => {
    if (sdk && sdk.keeper) {
      const paymentSubscriptionTemp = sdk.keeper.conditions.lockPaymentCondition.events.subscribe(
        (events) => {
          setPaymentEvents(events);
        },
        {
          filterSubgraph: {},
          methodName: 'getFulfilleds',
          result: {
            id: true,
            _did: true,
            _agreementId: true,
            _amounts: true,
            _receivers: true
          }
        }
      );
      setPaymentSubscription(paymentSubscriptionTemp);
    }
    return () => paymentSubscription?.unsubscribe();
  }, [sdk]);

  return { paymentEvents, paymentSubscription };
};

export const useSubscribeToTransferEvents = () => () => {
  const { sdk } = useContext(NeverminedContext);
  const [transferSubscription, setTransferSubscription] = useState<ContractEventSubscription>();
  const [transferEvents, setTransferEvents] = useState([] as EventResult[]);

  useEffect(() => {
    if (sdk && sdk.keeper) {
      const response = sdk.keeper.conditions.transferNftCondition.events.subscribe(
        (events) => {
          setTransferEvents(events);
        },
        {
          filterSubgraph: {},
          methodName: 'getFulfilleds',
          result: {
            id: true,
            _did: true,
            _agreementId: true,
            _amount: true,
            _receiver: true
          }
        }
      );
      setTransferSubscription(response);
    }

    return () => transferSubscription?.unsubscribe();
  }, [sdk]);

  return { transferEvents, transferSubscription };
};
