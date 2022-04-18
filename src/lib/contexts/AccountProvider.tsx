import { Account } from '@nevermined-io/nevermined-sdk-js';
import { useCallback, useEffect, useState } from 'react';
import { useNevermined } from './NeverminedProvider';
import { useWeb3Service } from './services';

export const useAccountManager = () => {
  const { sdk } = useNevermined();
  const { wallet } = useWeb3Service();
  const [address, setAddress] = useState<string>('');

  const isLoggedIn = useCallback(() => {
    if(!wallet?.isLoggedIn) return false;
    return wallet?.isLoggedIn();
  }, [wallet]);

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
    address,
    isLoggedIn
  };
};
