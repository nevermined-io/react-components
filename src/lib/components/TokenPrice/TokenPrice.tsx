import React, { useEffect, useState } from 'react';
import BN from 'bn.js';
import { useNevermined } from '../../contexts/NeverminedProvider';

interface TokenPriceProps {
  address: string;
  children: number | string | number[] | Uint8Array | Buffer | BN;
}

export const NuiTokenPrice = React.memo(function ({ address, children }: TokenPriceProps) {
  const {
    services: { tokenUtils }
  } = useNevermined();
  const [tokenDecimals, setTokenDecimals] = useState<number | null>(
    tokenUtils?.getInstantDecimals(address) || null
  );

  useEffect(() => {
    if (tokenDecimals === null && tokenUtils) {
      tokenUtils.getDecimals(address).then((value) => setTokenDecimals(value || null));
    }
  }, [address, tokenUtils]);

  try {
    const length = new BN(10).pow(new BN(tokenDecimals as any));
    const int = new BN(children).div(length).toString();
    const decimals = new BN(children)
      .mod(length)
      .toString()
      .padStart(tokenDecimals as any, '0')
      .replace(/0+$/, '');

    return (
      <>
        {int}
        {decimals ? `.${decimals}` : ''}
      </>
    );
  } catch {
    return <>n/a</>;
  }
});
