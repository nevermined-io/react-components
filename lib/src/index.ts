import * as nevermined from './nevermined';
import * as assetService from './services/asset';
import * as accountService from './services/account';
import * as eventService from './services/event';
import * as subscribeService from './services/subscribe';
import * as marketplaceTokenUtils from './utils/marketplace_token';
export * from './types';
export { getAgreementId } from './utils/index';

export const Catalog = {
  ...nevermined,
  ...assetService,
  ...accountService,
  ...eventService,
  ...subscribeService,
  ...marketplaceTokenUtils
};

export default Catalog;
