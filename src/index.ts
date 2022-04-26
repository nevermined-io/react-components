import { NeverminedProvider, useNevermined } from './lib/contexts';
import {
  useAccountManager,
  useAssetsManager,
  useTokenUtilsManager,
  useWeb3Manager
} from './lib/hooks';
import utils from './lib/utils';

const Catalog = {
  useNevermined,
  NeverminedProvider,
  useAccountManager,
  useAssetsManager,
  useTokenUtilsManager,
  useWeb3Manager,
  utils
};

export default Catalog;
