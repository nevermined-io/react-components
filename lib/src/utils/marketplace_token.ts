import { Nevermined } from '@nevermined-io/nevermined-sdk-js';
import { Account } from 'web3-core';
import { MarketplaceAPIToken } from '../types';

const MARKETPLACE_API_TOKEN = 'marketplaceApiToken';

export const saveMarketplaceApiTokenToLocalStorage = (i: MarketplaceAPIToken): void => {
  localStorage.setItem(
    MARKETPLACE_API_TOKEN,
    JSON.stringify({ token: i.token, expirationTime: i.expirationTime })
  );
};

export const fetchMarketplaceApiTokenFromLocalStorage = (): MarketplaceAPIToken => {
  const marketplaceApiTokenItem: string | null = localStorage.getItem('marketplaceApiToken');
  if (marketplaceApiTokenItem) {
    return JSON.parse(marketplaceApiTokenItem);
  } else {
    return {
      token: '',
      expirationTime: 0
    };
  }
};

export const newMarketplaceApiToken = async (sdk: Nevermined): Promise<MarketplaceAPIToken> => {
  try {
    const [account] = await sdk.accounts.list();
    const credential = await sdk.utils.jwt.generateClientAssertion(account);
    const token = await sdk.marketplace.login(credential);
    const jwtData = JSON.parse(window.atob(token.split('.')[1]));
    const expirationTime = +jwtData.exp * 1000;
    saveMarketplaceApiTokenToLocalStorage({ token, expirationTime });
    return { token, expirationTime };
  } catch (error) {
    console.log(error);
    return { token: '', expirationTime: 0 };
  }
};

export const isTokenValid = () => {
  const token = fetchMarketplaceApiTokenFromLocalStorage();
  if (!token.expirationTime || token.expirationTime < new Date().getTime()) {
    return false;
  }
  return true;
};
