import { Nevermined } from '@nevermined-io/nevermined-sdk-js';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { MarketplaceAPIToken } from '../types';

export const MARKETPLACE_API_TOKEN = 'marketplaceApiToken';

/*
 * Save MP token to local storage
 */
export const saveMarketplaceApiTokenToLocalStorage = (i: MarketplaceAPIToken): void => {
  localStorage.setItem(MARKETPLACE_API_TOKEN, JSON.stringify({ token: i.token }));
};

/*
 * get MP token to local storage
 */
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

/*
 * Generate new MP API token
 */
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


/*
 * Check if MP Token is valid
 */
export const isTokenValid = () => {
  try {
    const { token } = fetchMarketplaceApiTokenFromLocalStorage();
    if (token && jwt.decode(token)) {
      const decodedToken = jwt.decode(token);
      const expiry = (decodedToken as JwtPayload)?.exp;
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
