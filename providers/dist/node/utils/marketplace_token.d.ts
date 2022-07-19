import { Nevermined } from '@nevermined-io/nevermined-sdk-js';
import { MarketplaceAPIToken } from '../types';
export declare const fetchMarketplaceApiTokenFromLocalStorage: () => MarketplaceAPIToken;
export declare const newMarketplaceApiToken: (sdk: Nevermined) => Promise<MarketplaceAPIToken>;
export declare const isTokenValid: () => boolean;
