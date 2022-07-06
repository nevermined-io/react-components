import { Nevermined } from '@nevermined-io/nevermined-sdk-js';
import jwt from 'jsonwebtoken';
import { MarketplaceAPIToken } from '../types';

export const MARKETPLACE_API_TOKEN = 'marketplaceApiToken';

export const saveMarketplaceApiTokenToLocalStorage = (i: MarketplaceAPIToken): void => {
  localStorage.setItem(MARKETPLACE_API_TOKEN, JSON.stringify({ token: i.token }));
};

export const fetchMarketplaceApiTokenFromLocalStorage = (): MarketplaceAPIToken => {
  const marketplaceApiTokenItem: string | null = localStorage.getItem('marketplaceApiToken');
  if (marketplaceApiTokenItem) {
    return JSON.parse(marketplaceApiTokenItem);
  } else {
    return {
      token: ''
    };
  }
};

export const newMarketplaceApiToken = async (sdk: Nevermined): Promise<MarketplaceAPIToken> => {
  try {
    const [account] = await sdk.accounts.list();
    const credential = await sdk.utils.jwt.generateClientAssertion(account);
    const token = await sdk.marketplace.login(credential);
    saveMarketplaceApiTokenToLocalStorage({ token });
    return { token };
  } catch (error) {
    console.log(error);
    return { token: '' };
  }
};

export const isTokenValid = () => {
  try {
    const { token } = fetchMarketplaceApiTokenFromLocalStorage();
    if (token && jwt.decode(token)) {
      const decodedToken = jwt.decode(token);
      //@ts-ignore
      const expiry = decodedToken?.exp;
      if (expiry) {
        const now = new Date();
        return now.getTime() < Number(expiry) * 1000;
      }
    }
    return false;
  } catch (error) {
    return false;
  }
};
