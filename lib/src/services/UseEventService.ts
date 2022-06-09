import { Nevermined } from '@nevermined-io/nevermined-sdk-js';
import {
  ContractEventSubscription,
  EventResult
} from '@nevermined-io/nevermined-sdk-js/dist/node/events';
import { useContext, useEffect, useState } from 'react';
import { NeverminedContext } from '../nevermined';

export const usePaymentEvents = () => {
    const { sdk } = useContext(NeverminedContext);
    const [paymentEvents, setPaymentEvents] = useState([] as EventResult[]);
    const [isLoadingPaymentEvents, setIsLoadingPaymentEvents] = useState(false);

    useEffect(() => {
        const getPayments = async () => {
            if (sdk && sdk.keeper) {
                try {
                    setIsLoadingPaymentEvents(true);
                    const lockEventData = await sdk.keeper.conditions.lockPaymentCondition.events.getEventData({
                        filterSubgraph: {},
                        methodName: 'getFulfilleds',
                        result: {
                            id: true,
                            _did: true,
                            _agreementId: true,
                            _amounts: true,
                            _receivers: true,
                        },
                    });
                    setPaymentEvents(lockEventData);
                } catch (error) {
                    console.error(error);
                }
            }
            setIsLoadingPaymentEvents(false);
        };
        getPayments();
    }, [sdk]);

    return { paymentEvents, isLoadingPaymentEvents };
};

export const useUserTransferEvents = (id: string) => {
    const { sdk } = useContext(NeverminedContext);
    const [transferEvents, setTransferEvents] = useState([] as EventResult[]);
    const [isLoadingTransferEvents, setIsLoadingTransferEvents] = useState(false);

    useEffect(() => {
        const getTransfers = async () => {
            if (sdk && sdk.keeper && id) {
                try {
                    setIsLoadingTransferEvents(true);
                    const data = await sdk.keeper.conditions.transferNftCondition.events.getEventData({
                        filterSubgraph: {
                            where: {
                                _receiver: id,
                            },
                        },
                        methodName: 'getFulfilleds',
                        result: {
                            id: true,
                            _did: true,
                            _agreementId: true,
                            _receiver: true,
                        },
                    });
                    setTransferEvents(data);
                } catch (error) {
                    console.error(error);
                }
                setIsLoadingTransferEvents(false);
            }
        };
        getTransfers();
    }, [sdk]);

    return { isLoadingTransferEvents, transferEvents };
};
