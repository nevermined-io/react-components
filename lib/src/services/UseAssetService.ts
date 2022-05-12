import { DDO, DID, Nevermined, SearchQuery } from '@nevermined-io/nevermined-sdk-js';
import { useEffect, useState } from 'react';
import { GenericOutput, UseAssetService } from '../types';
import { useNevermined } from '../nevermined';

export const allAssetsDefaultQuery: SearchQuery = {
  offset: 2, // limit response to 2 items
  page: 1,
  query: {},
  sort: {
    created: -1
  }
};

export const fetchAssets = async (
  sdk: Nevermined,
  q: SearchQuery
): Promise<GenericOutput<DDO[], any>> => {
  try {
    const response = await sdk?.assets.query(q);
    return { success: true, data: response.results, error: undefined };
  } catch (error) {
    return { success: false, data: [], error };
  }
};

const useAssetService = (): UseAssetService => {
  const { sdk } = useNevermined();
  const [assets, setAssets] = useState<DDO[]>([]);
  const [errorFetchAssets, setErrorFetchAssets] = useState<any>(undefined);
  const [isLoadingFetchAssets, setIsLoadingFetchAssets] = useState<boolean>(false);

  const getAssetDDO = async (did: DID | string): Promise<DDO> => {
    const res = await sdk.metadata.retrieveDDO(did);
    return res;
  };

  const useFetchAssets = (query = allAssetsDefaultQuery): void => {
    const { sdk } = useNevermined();

    useEffect(() => {
      if (!sdk?.assets) {
        return;
      }
      setIsLoadingFetchAssets(true);
      const handler = async () => {
        const response = await fetchAssets(sdk, query);
        if (response.success) {
          setAssets(response.data);
          setErrorFetchAssets(undefined);
        } else {
          setErrorFetchAssets(response.error);
        }
        setIsLoadingFetchAssets(false);
      };
      handler();
    }, [sdk, query]);
  };

  return { getAssetDDO, assets, isLoadingFetchAssets, errorFetchAssets, useFetchAssets };
};

export default useAssetService;
