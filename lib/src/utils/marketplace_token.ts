import { Nevermined } from '@nevermined-io/nevermined-sdk-js';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { MarketplaceAPIToken } from '../types';

export const MARKETPLACE_API_TOKEN = 'marketplaceApiToken';

/**
 * Save Marketplace API token to local storage
 * @param i Auth token object which is generated from Marketplace API
 */
export const saveMarketplaceApiTokenToLocalStorage = (i: MarketplaceAPIToken): void => {
  localStorage.setItem(MARKETPLACE_API_TOKEN, JSON.stringify({ token: i.token }));
};

/**
 * Get Marketplace API token to local storage
 * 
 * @return Auth token object which generated from Marketplace API
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

/**
 * Generate new Marketplace API API token
 * @param sdk Instance of SDK object
 * @return Auth token object which generated from Marketplace API
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


/**
 * Check if Marketplace API Token is valid
 * @return Return `true` if token is valid
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
