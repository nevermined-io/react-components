import React, { useEffect, useState } from 'react';
import { DDO } from '@nevermined-io/nevermined-sdk-js';
import { useNevermined } from 'lib/contexts/NeverminedProvider';

export interface QueryAssetsProps {
  infinite?: boolean;
  size?: number;
  children: (
    assets: DDO[],
    info: QueryStats & { canGoNext: boolean; canGoPrev: boolean },
    goNext: () => void,
    goPrev?: () => void
  ) => any;
}

export interface QueryStats {
  page: number;
  totalPages: number;
  totalResults: number;
}

const QueryAssetExample = () => {
  const { sdk } = useNevermined();
  const [assets, setAssets] = useState<DDO[]>([]);

  useEffect(() => {
    if (!sdk?.assets) {
      return;
    }
    fetchAllAssets();
  }, [sdk]);

  const fetchAllAssets = () => {
    sdk?.assets
      .query({
        offset: 100,
        page: 1,
        query: {},
        sort: {
          created: -1
        }
      })
      .then((result) => {
        console.log('result', result);
        //       setStats({ ...result, results: undefined } as any);
        setAssets(result.results);
      });
  };

  return (
    <div>
      <div style={{ fontSize: '28px' }}>{JSON.stringify(assets, null, 6)}</div>
    </div>
  );
};

export default QueryAssetExample;
