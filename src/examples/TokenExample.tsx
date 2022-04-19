import React from 'react';
import { NuiTokenName } from './components/TokenName/TokenName';
import { NuiTokenPrice } from './components/TokenPrice/TokenPrice';

const TokenExample = () => {
  return (
    <section>
      <NuiTokenPrice address="0x022E292b44B5a146F2e8ee36Ff44D3dd863C915c">
        1234567890000000000
      </NuiTokenPrice>{' '}
      <NuiTokenName address="0x022E292b44B5a146F2e8ee36Ff44D3dd863C915c" />
    </section>
  );
};

export default TokenExample;
