"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useUserTransferEvents = exports.usePaymentEvents = void 0;
const react_1 = require("react");
const nevermined_1 = require("../nevermined");
const usePaymentEvents = () => {
    const { sdk } = (0, react_1.useContext)(nevermined_1.NeverminedContext);
    const [paymentEvents, setPaymentEvents] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const getPayments = async () => {
            if (sdk && sdk.keeper) {
                try {
                    setIsLoading(true);
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
                }
                catch (error) {
                    console.error(error);
                }
            }
            setIsLoading(false);
        };
        getPayments();
    }, [sdk]);
    return { paymentEvents, isLoading };
};
exports.usePaymentEvents = usePaymentEvents;
const useUserTransferEvents = (id) => {
    const { sdk } = (0, react_1.useContext)(nevermined_1.NeverminedContext);
    const [transferEvents, setTransferEvents] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const getTransfers = async () => {
            if (sdk && sdk.keeper && id) {
                try {
                    setIsLoading(true);
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
                }
                catch (error) {
                    console.error(error);
                }
                setIsLoading(false);
            }
        };
        getTransfers();
    }, [sdk]);
    return { isLoading, transferEvents };
};
exports.useUserTransferEvents = useUserTransferEvents;
