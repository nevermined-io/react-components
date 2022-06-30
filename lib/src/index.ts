import * as nevermined from './nevermined';
import * as assetService from './services/asset';
import * as accountService from './services/account';
import * as eventService from './services/event';
import * as subscribeService from './services/subscribe';
import * as wallet from './services/wallet';

export const Catalog = {
  ...nevermined,
  ...assetService,
  ...accountService,
  ...eventService,
  ...subscribeService,
  ...wallet
};

export default Catalog;
