"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSubscribeToTransferEvents = exports.useSubscribeToPaymentEvents = void 0;
const react_1 = require("react");
const nevermined_1 = require("../nevermined");
const useSubscribeToPaymentEvents = () => () => {
    const { sdk } = (0, react_1.useContext)(nevermined_1.NeverminedContext);
    const [paymentSubscription, setPaymentSubscription] = (0, react_1.useState)();
    const [paymentEvents, setPaymentEvents] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        if (sdk && sdk.keeper) {
            const paymentSubscriptionTemp = sdk.keeper.conditions.lockPaymentCondition.events.subscribe((events) => {
                setPaymentEvents(events);
            }, {
                filterSubgraph: {},
                methodName: 'getFulfilleds',
                result: {
                    id: true,
                    _did: true,
                    _agreementId: true,
                    _amounts: true,
                    _receivers: true
                }
            });
            setPaymentSubscription(paymentSubscriptionTemp);
        }
        return () => paymentSubscription === null || paymentSubscription === void 0 ? void 0 : paymentSubscription.unsubscribe();
    }, [sdk]);
    return { paymentEvents, paymentSubscription };
};
exports.useSubscribeToPaymentEvents = useSubscribeToPaymentEvents;
const useSubscribeToTransferEvents = () => () => {
    const { sdk } = (0, react_1.useContext)(nevermined_1.NeverminedContext);
    const [transferSubscription, setTransferSubscription] = (0, react_1.useState)();
    const [transferEvents, setTransferEvents] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        if (sdk && sdk.keeper) {
            const response = sdk.keeper.conditions.transferNftCondition.events.subscribe((events) => {
                setTransferEvents(events);
            }, {
                filterSubgraph: {},
                methodName: 'getFulfilleds',
                result: {
                    id: true,
                    _did: true,
                    _agreementId: true,
                    _amount: true,
                    _receiver: true
                }
            });
            setTransferSubscription(response);
        }
        return () => transferSubscription === null || transferSubscription === void 0 ? void 0 : transferSubscription.unsubscribe();
    }, [sdk]);
    return { transferEvents, transferSubscription };
};
exports.useSubscribeToTransferEvents = useSubscribeToTransferEvents;
