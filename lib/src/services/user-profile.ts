import React, { useEffect, useContext, useState } from 'react';
import { Account } from '@nevermined-io/nevermined-sdk-js';
import { useNevermined } from '../nevermined';
import { WalletContext } from './wallet';
import { UserProfileParams } from '../types';
import { saveMarketplaceApiTokenToLocalStorage } from '../utils/marketplace_token';

export const useUserProfile = () => {
  const { sdk, account } = useNevermined();
  const { walletAddress, w3 } = useContext(WalletContext);
  const [inputError, setInputError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isUpdated, setIsUpated] = useState(false);
  const [isAddressAdded, setIsAddressAdded] = useState(false);

  const [userId, setUserId] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfileParams>({
    nickname: '',
    name: '',
    email: '',
    additionalInformation: {
      linkedinProfile: ''
    }
  });
  const [newAddress, setNewAddress] = useState('');

  const [addresses, setAddresses] = useState<string[]>([]);

  const onAddAddress = async () => {
    try {
      const ethAccounts = await w3.current?.eth.requestAccounts();
      const accounts = ethAccounts?.map((a) => new Account(a));
      const accountToAdd = accounts?.find((a) => a.getId() === newAddress);
      const credential = await sdk.utils.jwt.generateClientAssertion(accountToAdd);
      const token = await sdk.marketplace.addNewAddress(credential);
      const jwtData = JSON.parse(window.atob(token.split('.')[1]));
      const expirationTime = +jwtData.exp * 1000;

      saveMarketplaceApiTokenToLocalStorage({ token, expirationTime });
      setAddresses([...addresses, newAddress]);
      setNewAddress('');
      setIsAddressAdded(true);
      setSuccessMessage('Address is added successfully');
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const onSubmitUserProfile = async () => {
    try {
      if (!account.isTokenValid()) {
        await account.generateToken();
      }
      if (!userProfile.nickname) {
        setInputError('Nickname is required');
        return;
      }
      await sdk.profiles.update(userId, userProfile);
      setIsUpated(true);
      setSuccessMessage('Your profile is updated successfully');
      setInputError('');
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    if (isUpdated || isAddressAdded) {
      setTimeout(() => {
        setIsUpated(false);
        setIsAddressAdded(false);
        setSuccessMessage('');
      }, 3000);
    }
  }, [isUpdated, isAddressAdded]);

  useEffect(() => {
    (async () => {
      try {
        if (!walletAddress || !sdk.profiles) {
          return;
        }

        const userProfileData = await sdk.profiles.findOneByAddress(walletAddress);
        setUserId(userProfileData.userId);

        if (userProfileData.addresses.some((a) => a === walletAddress)) {
          setNewAddress('');
        }

        setAddresses([...userProfileData.addresses]);

        setUserProfile({
          nickname: userProfileData.nickname,
          name: userProfileData.name,
          email: userProfileData.email,
          additionalInformation: userProfileData.additionalInformation
        });
      } catch (error) {
        if (addresses?.length && !addresses.some((a) => a.toLowerCase() === walletAddress)) {
          setNewAddress(walletAddress);
        } else {
          setErrorMessage('Error getting user profile');
        }
      }
    })();
  }, [sdk.profiles, walletAddress]);

  return {
    inputError,
    errorMessage,
    successMessage,
    isUpdated,
    isAddressAdded,
    userProfile,
    addresses,
    newAddress,
    setUserProfile,
    onAddAddress,
    onSubmitUserProfile
  };
};
