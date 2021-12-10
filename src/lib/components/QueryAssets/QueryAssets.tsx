import React, { useEffect, useState } from 'react';
import { DDO } from '@nevermined-io/nevermined-sdk-js';

import { useNevermined } from 'lib/contexts/NeverminedProvider';

interface QueryAssetsProps {
  infinite?: boolean // works with pagination or infinite
}

interface QueryStats {
  page: number
  totalPages: number
  totalResults: number
}

export const NuiQueryAssets = React.memo(function ({}: QueryAssetsProps) {
  const { sdk } = useNevermined();
  const [ assets, setAssets ] = useState<DDO[]>([]);
  const [ stats, setStats ] = useState<QueryStats>();

  useEffect(() => {
    if (!sdk?.assets) {
      return
    }
    sdk.assets
      .query({
        offset: 10,
        page: 1,
        query: {},
        sort: {
          created: -1
        },
      })
      .then(result => {
        setStats({...result, results: undefined} as any)
        setAssets(result.results)
      })
  }, [sdk])

  return <>QueryAssets</>
});
