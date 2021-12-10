import React, { useEffect, useState } from 'react';
import { useNevermined } from 'lib/contexts/NeverminedProvider';

interface QueryAssetsProps {
}

export const NuiQueryAssets = React.memo(function ({}: QueryAssetsProps) {
  const { sdk } = useNevermined();

  return <>QueryAssets</>
});
