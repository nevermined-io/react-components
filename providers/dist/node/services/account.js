"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAccountCollection = exports.useAccountReleases = void 0;
const react_1 = require("react");
const nevermined_1 = require("../nevermined");
const useAccountReleases = (id, format) => {
    const [accountReleases, setAccountReleases] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const { account, sdk } = (0, react_1.useContext)(nevermined_1.NeverminedContext);
    (0, react_1.useEffect)(() => {
        const loadReleases = async () => {
            setIsLoading(true);
            const data = await account.getReleases(id);
            setAccountReleases(data);
            if (format) {
                setAccountReleases(format(data));
            }
            else {
                setAccountReleases(data);
            }
            setIsLoading(false);
        };
        loadReleases();
    }, [id]);
    return { isLoading, accountReleases };
};
exports.useAccountReleases = useAccountReleases;
const useAccountCollection = (id, format) => {
    const { sdk, account } = (0, react_1.useContext)(nevermined_1.NeverminedContext);
    const [isLoading, setLoading] = (0, react_1.useState)(true);
    const [accountCollection, setAccountCollection] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        const loadCollection = async () => {
            if (!id || !sdk.utils)
                return;
            setLoading(true);
            const data = await account.getCollection(id);
            if (format) {
                setAccountCollection(format(data));
            }
            else {
                setAccountCollection(data);
            }
            setLoading(false);
        };
        loadCollection();
    }, [id, sdk]);
    return { isLoading, accountCollection };
};
exports.useAccountCollection = useAccountCollection;
