import { Account } from '@nevermined-io/nevermined-sdk-js';
import { useNevermined } from 'lib/contexts/NeverminedProvider';
import { useEffect, useState } from 'react';

export const useAccountManager = (): { address: string } => {
  const { sdk } = useNevermined();
  const [address, setAddress] = useState<string>('');

  useEffect(() => {
    Promise.resolve(sdk?.accounts?.list())
      .then((accounts: Account[]) => {
        if (accounts?.length) {
          setAddress(accounts[0].getId());
        }
      })
      .catch((err) => {
        console.log('err fetching account');
        console.log(err);
      });
  }, [sdk]);

  return {
    address
  };
};
