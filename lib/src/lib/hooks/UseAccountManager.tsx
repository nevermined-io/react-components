import { Account } from '@nevermined-io/nevermined-sdk-js';
import { useNevermined } from '../contexts/NeverminedProvider';
import { UseIsAccountLoggedInInput, Web3Manager } from '../types';
import { useEffect, useState } from 'react';

export const useAccountAddressManager = (): {
  address: string;
  updateAddress: (address: string) => void;
} => {
  const { sdk, web3Manager } = useNevermined();
  const [address, setAddress] = useState<string>('');

  const updateAddress = (address: string) => {
    setAddress(address);
  };

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
  }, [sdk, web3Manager]);

  return {
    address,
    updateAddress
  };
};

export const useAccountLogInManager = (
  web3Manager: Web3Manager,
  address: string
): UseIsAccountLoggedInInput => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const handler = async () => {
      const response = await web3Manager?.isLoggedIn();
      setIsLoggedIn(response);
    };
    handler();
  }, [web3Manager, address]);

  return { isLoggedIn, setIsLoggedIn };
};
