import { useTokenUtilsService } from 'lib/hooks/UseTokenUtilsManager';
import React, { useEffect, useState } from 'react';

interface TokenNameProps {
  address: string;
}

export const NuiTokenName = React.memo(function ({ address }: TokenNameProps) {
  const { tokenUtils } = useTokenUtilsService();
  const [tokenSymbol, setTokenSymbol] = useState<string | null>(
    tokenUtils?.getInstantSymbol(address) || null
  );

  useEffect(() => {
    //tokenSymbol === null &&
    if (tokenUtils) {
      tokenUtils.getSymbol(address).then((value) => setTokenSymbol(value || null));
    }
  }, [address, tokenUtils]);

  return <>{tokenSymbol}</>;
});
