import { EventResult } from '@nevermined-io/nevermined-sdk-js/dist/node/events';
export declare const usePaymentEvents: () => {
    paymentEvents: EventResult[];
    isLoading: boolean;
};
export declare const useUserTransferEvents: (id: string) => {
    isLoading: boolean;
    transferEvents: EventResult[];
};
