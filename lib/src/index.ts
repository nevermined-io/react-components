import NeverminedProvider, {
  useNevermined,
  useNeverminedService,
  initializeNevermined
} from './nevermined';
import useAssetService from './services/UseAssetService';

const Catalog = {
  useNeverminedService,
  NeverminedProvider,
  useNevermined,
  useAssetService
};

export default Catalog;
