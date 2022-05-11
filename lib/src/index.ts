import NeverminedProvider, { useNevermined, getEtheruemProvider } from './nevermined';
import useWeb3Service from './services/UseWeb3Service';
import useAssetService from './services/UseAssetService';

const Catalog = {
  getEtheruemProvider,
  NeverminedProvider,
  useNevermined,
  useWeb3Service,
  useAssetService
};

export default Catalog;
