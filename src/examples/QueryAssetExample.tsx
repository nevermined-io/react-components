import React from 'react';
import { NuiQueryAssets } from './components/QueryAssets';

const QueryAssetExample = () => {
  return (
    <div>
      <NuiQueryAssets>
        {(assets, info, goNext, goPrev) => {
          return <div style={{ fontSize: '28px' }}>{JSON.stringify(info, null, 6)}</div>;
        }}
      </NuiQueryAssets>
    </div>
  );
};

export default QueryAssetExample;
