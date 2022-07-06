import React, { useEffect, useContext, useState } from 'react';
import { useNevermined } from '../nevermined';
import { WalletContext } from './wallet';
import { UserProfileParams } from '../types';
import { saveMarketplaceApiTokenToLocalStorage } from '../utils/marketplace_token';

export const useUserProfile = () => {
  const { sdk, account } = useNevermined();
  const { walletAddress } = useContext(WalletContext);
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
      let accounts = await sdk.accounts.list();
      let accountToAdd = accounts?.find((a) => a.getId() === newAddress);

      if (!accountToAdd) {
        accounts = await sdk.accounts.requestList();
        accountToAdd = accounts?.find((a) => a.getId() === newAddress);
      }

      const credential = await sdk.utils.jwt.generateClientAssertion(accountToAdd);
      const token = await sdk.marketplace.addNewAddress(credential);

      saveMarketplaceApiTokenToLocalStorage({ token });
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

        if (!account.isTokenValid()) {
          await account.generateToken();
        }

        setAddresses([...userProfileData.addresses]);

        setUserProfile({
          nickname: userProfileData.nickname,
          name: userProfileData.name,
          email: userProfileData.email,
          additionalInformation: userProfileData.additionalInformation
        });
      } catch (error: any) {
        if (addresses?.length && !addresses.some((a) => a.toLowerCase() === walletAddress)) {
          setNewAddress(walletAddress);
        } else if (error.message.includes('"statusCode":404')) {
          await account.generateToken();
          setUserProfile({
            nickname: walletAddress
          });
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
