import React from 'react';
import { useAllAssets } from 'lib/hooks/UseAssetManager';

const QueryAssetExample = () => {
  const { assets } = useAllAssets();

  return (
    <div>
      <div style={{ fontSize: '28px' }}>{JSON.stringify(assets, null, 6)}</div>
    </div>
  );
};

export default QueryAssetExample;
