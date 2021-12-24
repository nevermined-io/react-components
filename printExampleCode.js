let str = `
import React from 'react';
import { NuiTokenName } from 'lib/components/TokenName/TokenName';
import { NuiTokenPrice } from 'lib/components/TokenPrice/TokenPrice';

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
`;
str = '```tsx' + str + '```';
str = str.replace(/^/gm, ' *');

console.log(str);
