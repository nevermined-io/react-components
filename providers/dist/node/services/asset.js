"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAsset = exports.useAssets = void 0;
const react_1 = require("react");
const nevermined_1 = require("../nevermined");
const useAssets = (q) => {
    const { assets, sdk } = (0, react_1.useContext)(nevermined_1.NeverminedContext);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [result, setResult] = (0, react_1.useState)({});
    const handler = async () => {
        try {
            if (!q)
                return;
            setIsLoading(true);
            const queryResponse = await assets.query(q);
            setResult(queryResponse);
            setIsLoading(false);
        }
        catch (error) {
            setIsLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        if (isLoading)
            return;
        handler();
    }, [assets, sdk, q]);
    return {
        result,
        isLoading
    };
};
exports.useAssets = useAssets;
const useAsset = (did) => {
    const { assets } = (0, react_1.useContext)(nevermined_1.NeverminedContext);
    const [state, setState] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        const getData = async () => {
            try {
                const ddo = await assets.resolve(did);
                if (!ddo)
                    return;
                const metaData = ddo.findServiceByType('metadata').attributes;
                const nftDetails = await assets.nftDetails(did);
                setState({
                    ddo,
                    metadata: metaData,
                    nftDetails,
                    error: '',
                    isLoading: false
                });
            }
            catch (e) {
                console.error(e);
            }
        };
        getData();
    }, [did, assets]);
    return Object.assign({}, state);
};
exports.useAsset = useAsset;
