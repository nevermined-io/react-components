import React from 'react';

const QueryAssetExample = () => {
  //const { assets } = useAllAssets();
  const assets: any = [];

  return (
    <div>
      <div style={{ fontSize: '28px' }}>{JSON.stringify(assets, null, 6)}</div>
    </div>
  );
};

export default QueryAssetExample;
