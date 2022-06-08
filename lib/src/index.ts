import NeverminedProvider, { useNevermined } from './nevermined';
import { useAllAssets, useAsset } from './services/UseAssetService';

const Catalog = {
  NeverminedProvider,
  useNevermined,
  useAllAssets,
  useAsset
};

export default Catalog;
