import * as nevermined from './nevermined';
import * as assetService from './services/asset';
import * as accountService from './services/account';
import * as eventService from './services/event';
import * as subscribeService from './services/subscribe';
import * as wallet from './services/wallet';
import * as marketplaceTokenUtils from './utils/marketplace_token';

export const Catalog = {
  ...nevermined,
  ...assetService,
  ...accountService,
  ...eventService,
  ...subscribeService,
  ...wallet,
  ...marketplaceTokenUtils
};

export default Catalog;
