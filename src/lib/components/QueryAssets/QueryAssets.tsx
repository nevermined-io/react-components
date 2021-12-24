import React, { useEffect, useState, useCallback } from 'react';
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

export const NuiQueryAssets = React.memo(function ({
  children,
  infinite,
  size = 12
}: QueryAssetsProps) {
  const { sdk } = useNevermined();
  const [assets, setAssets] = useState<DDO[]>([]);
  const [stats, setStats] = useState<QueryStats>();
  const [page, setPage] = useState<number>(1);
  console.log('page', page);
  const canGoNext = page < (stats?.totalPages || -Infinity);
  const canGoPrev = page > 1 && !infinite;

  useEffect(() => {
    setAssets([]);
    setPage(1);
  }, [infinite]);

  useEffect(() => {
    if (!sdk?.assets) {
      return;
    }
    sdk.assets
      .query({
        offset: size,
        page,
        query: {},
        sort: {
          created: -1
        }
      })
      .then((result) => {
        setStats({ ...result, results: undefined } as any);
        if (infinite) {
          setAssets([...assets, ...result.results]);
        } else {
          setAssets(result.results);
        }
      });
  }, [sdk, page, infinite]);

  const goNext = useCallback(() => {
    if (canGoNext) {
      setPage(page + 1);
    }
  }, [page, infinite]);

  const goPrev = useCallback(() => {
    if (canGoPrev) {
      setPage(page - 1);
    }
  }, [page, infinite]);

  if (stats && goNext && goPrev) {
    return children(assets, { ...stats, canGoNext, canGoPrev }, goNext, goPrev);
  }
  return null;
});
