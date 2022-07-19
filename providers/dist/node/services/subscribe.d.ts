import { ContractEventSubscription, EventResult } from '@nevermined-io/nevermined-sdk-js/dist/node/events';
export declare const useSubscribeToPaymentEvents: () => () => {
    paymentEvents: EventResult[];
    paymentSubscription: ContractEventSubscription | undefined;
};
export declare const useSubscribeToTransferEvents: () => () => {
    transferEvents: EventResult[];
    transferSubscription: ContractEventSubscription | undefined;
};
