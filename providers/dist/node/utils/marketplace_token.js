"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTokenValid = exports.newMarketplaceApiToken = exports.fetchMarketplaceApiTokenFromLocalStorage = void 0;
const MARKETPLACE_API_TOKEN = 'marketplaceApiToken';
const saveMarketplaceApiTokenToLocalStorage = (i) => {
    localStorage.setItem(MARKETPLACE_API_TOKEN, JSON.stringify({ token: i.token, expirationTime: i.expirationTime }));
};
const fetchMarketplaceApiTokenFromLocalStorage = () => {
    const marketplaceApiTokenItem = localStorage.getItem('marketplaceApiToken');
    if (marketplaceApiTokenItem) {
        return JSON.parse(marketplaceApiTokenItem);
    }
    else {
        return {
            token: '',
            expirationTime: 0
        };
    }
};
exports.fetchMarketplaceApiTokenFromLocalStorage = fetchMarketplaceApiTokenFromLocalStorage;
const newMarketplaceApiToken = async (sdk) => {
    try {
        const [account] = await sdk.accounts.list();
        const credential = await sdk.utils.jwt.generateClientAssertion(account);
        const token = await sdk.marketplace.login(credential);
        const jwtData = JSON.parse(window.atob(token.split('.')[1]));
        const expirationTime = +jwtData.exp * 1000;
        saveMarketplaceApiTokenToLocalStorage({ token, expirationTime });
        return { token, expirationTime };
    }
    catch (error) {
        console.log(error);
        return { token: '', expirationTime: 0 };
    }
};
exports.newMarketplaceApiToken = newMarketplaceApiToken;
const isTokenValid = () => {
    const token = (0, exports.fetchMarketplaceApiTokenFromLocalStorage)();
    if (!token.expirationTime || token.expirationTime < new Date().getTime()) {
        return false;
    }
    return true;
};
exports.isTokenValid = isTokenValid;
