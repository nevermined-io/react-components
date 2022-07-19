"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNevermined = exports.NeverminedContext = exports.NeverminedProvider = exports.initializeNevermined = exports.neverminedReducer = exports.initialState = void 0;
const nevermined_sdk_js_1 = require("@nevermined-io/nevermined-sdk-js");
const react_1 = __importStar(require("react"));
const utils_1 = require("./utils");
const marketplace_token_1 = require("./utils/marketplace_token");
exports.initialState = {
    sdk: {}
};
const neverminedReducer = (state, action) => {
    console.log('action', action);
    switch (action.type) {
        case 'SET_SDK':
            return { sdk: action.payload.sdk };
        default:
            return state;
    }
};
exports.neverminedReducer = neverminedReducer;
const initializeNevermined = async (config) => {
    try {
        console.log('Loading SDK Started..');
        console.log('Marketplace auth token: ', config.marketplaceAuthToken);
        const nvmSdk = await nevermined_sdk_js_1.Nevermined.getInstance(Object.assign({}, config));
        console.log('Loading SDK Finished Successfully');
        return { data: nvmSdk, error: undefined, success: true };
    }
    catch (error) {
        console.log('Loading SDK Failed:');
        console.log(error);
        return { data: {}, error, success: false };
    }
};
exports.initializeNevermined = initializeNevermined;
const NeverminedProvider = ({ children, config, verbose }) => {
    const [{ sdk }, dispatch] = (0, react_1.useReducer)(exports.neverminedReducer, exports.initialState);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(undefined);
    (0, react_1.useEffect)(() => {
        const loadNevermined = async () => {
            if (!config.web3Provider) {
                console.log('Please include web3 proivder in your sdk config. aborting.');
                return;
            }
            setIsLoading(true);
            const { data, success, error } = await (0, exports.initializeNevermined)(config);
            if (success) {
                dispatch({ type: 'SET_SDK', payload: { sdk: data } });
            }
            setError(error);
            setIsLoading(false);
        };
        loadNevermined();
    }, [config]);
    const updateSDK = async (newConfig) => {
        const newSDK = await (0, exports.initializeNevermined)(Object.assign(Object.assign({}, config), newConfig));
        if (newSDK.success) {
            dispatch({ type: 'SET_SDK', payload: { sdk: newSDK.data } });
        }
        return newSDK.success;
    };
    const account = {
        isTokenValid: () => (0, marketplace_token_1.isTokenValid)(),
        generateToken: async () => {
            const tokenData = await (0, marketplace_token_1.newMarketplaceApiToken)(sdk);
            const { data, success } = await (0, exports.initializeNevermined)(Object.assign(Object.assign({}, config), { marketplaceAuthToken: tokenData.token }));
            dispatch({ type: 'SET_SDK', payload: { sdk: data } });
            return tokenData;
        },
        getReleases: async (address) => {
            try {
                const query = await sdk.keeper.didRegistry.events.getPastEvents({
                    eventName: 'DidAttributeRegistered',
                    methodName: 'getDIDAttributeRegistereds',
                    filterSubgraph: {
                        where: { _owner: address },
                        orderBy: '_blockNumberUpdated',
                        orderDirection: 'desc'
                    },
                    result: {
                        _did: true
                    }
                });
                return (query === null || query === void 0 ? void 0 : query.map((item) => item._did)) || [];
            }
            catch (error) {
                verbose && nevermined_sdk_js_1.Logger.error(error);
                return [];
            }
        },
        getCollection: async (address) => {
            var _a, _b, _c, _d;
            try {
                const query = await ((_d = (_c = (_b = (_a = sdk === null || sdk === void 0 ? void 0 : sdk.keeper) === null || _a === void 0 ? void 0 : _a.conditions) === null || _b === void 0 ? void 0 : _b.transferNftCondition) === null || _c === void 0 ? void 0 : _c.events) === null || _d === void 0 ? void 0 : _d.getPastEvents({
                    eventName: 'Fulfilled',
                    methodName: 'getFulfilleds',
                    filterSubgraph: {
                        where: { _receiver: address },
                        orderBy: '_did',
                        orderDirection: 'desc'
                    },
                    result: {
                        _did: true
                    }
                }));
                if (!query || query.length == 0)
                    return [];
                const dids = [...new Set(query.map((item) => item._did))]; //unique items
                return dids;
            }
            catch (error) {
                verbose && nevermined_sdk_js_1.Logger.error(error);
                return [];
            }
        }
    };
    const events = {
        fetchAccountTransferEvents: async (address) => {
            try {
                const data = await sdk.keeper.conditions.transferNftCondition.events.getEventData({
                    filterSubgraph: {
                        where: {
                            _receiver: address
                        }
                    },
                    methodName: 'getFulfilleds',
                    result: {
                        id: true,
                        _did: true,
                        _agreementId: true,
                        _receiver: true
                    }
                });
                return data;
            }
            catch (error) {
                verbose && nevermined_sdk_js_1.Logger.error(error);
                return [];
            }
        }
    };
    const assets = {
        getSingle: async (did) => {
            try {
                if ((0, utils_1.isEmptyObject)(sdk))
                    return {};
                const ddo = await sdk.assets.resolve(String(did));
                const metaData = ddo.findServiceByType('metadata').attributes;
                const nftDetails = await sdk.nfts.details(String(did));
                return ddo;
            }
            catch (e) {
                verbose && nevermined_sdk_js_1.Logger.error(error);
                return {};
            }
        },
        query: async (q) => {
            try {
                if ((0, utils_1.isEmptyObject)(sdk))
                    return {};
                const queryResponse = await (sdk === null || sdk === void 0 ? void 0 : sdk.assets.query(q));
                return queryResponse;
            }
            catch (error) {
                verbose && nevermined_sdk_js_1.Logger.error(error);
                return {};
            }
        },
        mint: async (input) => {
            try {
                if ((0, utils_1.isEmptyObject)(sdk))
                    return undefined;
                const [publisherAddress] = await sdk.accounts.list();
                if (!publisherAddress) {
                    console.log('No account was found!');
                    return;
                }
                const minted = await sdk.nfts.create(input.metadata, publisherAddress, input.cap, input.royalties, input.assetRewards, input.nftAmount || undefined, input.erc20TokenAddress || undefined, input.preMint || false, input.nftMetadata || undefined, // uri
                input.txParams || undefined);
                return minted;
            }
            catch (error) {
                verbose && nevermined_sdk_js_1.Logger.error(error);
                return undefined;
            }
        },
        resolve: async (did) => {
            try {
                if ((0, utils_1.isEmptyObject)(sdk))
                    return undefined;
                const resvoledAsset = await sdk.assets.resolve(did);
                return resvoledAsset;
            }
            catch (error) {
                verbose && nevermined_sdk_js_1.Logger.error(error);
                return undefined;
            }
        },
        nftDetails: async (did) => {
            try {
                if ((0, utils_1.isEmptyObject)(sdk))
                    return {};
                const details = sdk.nfts.details(did);
                return details;
            }
            catch (error) {
                verbose && nevermined_sdk_js_1.Logger.error(error);
                return {};
            }
        }
    };
    const subscribe = {
        paymentEvents: (cb) => {
            try {
                const config = {
                    filterSubgraph: {},
                    methodName: 'getFulfilleds',
                    result: {
                        id: true,
                        _did: true,
                        _agreementId: true,
                        _amounts: true,
                        _receivers: true
                    }
                };
                return sdk.keeper.conditions.lockPaymentCondition.events.subscribe(cb, config);
            }
            catch (error) {
                verbose && nevermined_sdk_js_1.Logger.error(error);
                return {};
            }
        },
        transferEvents: (cb) => {
            try {
                const config = {
                    filterSubgraph: {},
                    methodName: 'getFulfilleds',
                    result: {
                        id: true,
                        _did: true,
                        _agreementId: true,
                        _amounts: true,
                        _receivers: true
                    }
                };
                return sdk.keeper.conditions.transferNftCondition.events.subscribe(cb, config);
            }
            catch (error) {
                verbose && nevermined_sdk_js_1.Logger.error(error);
                return {};
            }
        }
    };
    const IState = {
        sdk,
        isLoadingSDK: isLoading,
        sdkError: error,
        subscribe,
        assets,
        account,
        events,
        updateSDK
    };
    return react_1.default.createElement(exports.NeverminedContext.Provider, { value: IState }, children);
};
exports.NeverminedProvider = NeverminedProvider;
exports.NeverminedContext = (0, react_1.createContext)({});
const useNevermined = () => (0, react_1.useContext)(exports.NeverminedContext);
exports.useNevermined = useNevermined;
