import React, { useEffect, useState } from 'react';
import { useNevermined } from '../../contexts/NeverminedProvider';

interface TokenNameProps {
  address: string;
}

export const NuiTokenName = React.memo(function ({ address }: TokenNameProps) {
  const {
    services: { tokenUtils }
  } = useNevermined();
  const [tokenSymbol, setTokenSymbol] = useState<string | null>(
    tokenUtils?.getInstantSymbol(address) || null
  );

  useEffect(() => {
    if (tokenSymbol === null && tokenUtils) {
      tokenUtils.getSymbol(address).then((value) => setTokenSymbol(value || null));
    }
  }, [address, tokenUtils]);

  return <>{tokenSymbol}</>;
});
