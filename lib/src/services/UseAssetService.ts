import { DDO, DID, SearchQuery } from '@nevermined-io/nevermined-sdk-js';
import { useEffect, useState } from 'react';
import { UseAssetService } from '../types';
import { useNevermined } from '../nevermined';

const allAssetsDefaultQuery: SearchQuery = {
  offset: 1,
  page: 1,
  query: {},
  sort: {
    created: -1
  }
};

const useAssetService = (): UseAssetService => {
  const { sdk } = useNevermined();
  const [assets, setAssets] = useState<DDO[]>([]);
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
      const fetchAllAssets = (q: SearchQuery) => {
        setIsLoadingFetchAssets(true);
        sdk?.assets.query(q).then((result: any) => {
          setAssets(result.results);
          setIsLoadingFetchAssets(false);
        });
      };
      fetchAllAssets(query);
    }, [sdk, query]);
  };

  return { getAssetDDO, assets, isLoadingFetchAssets, useFetchAssets };
};

export default useAssetService;
