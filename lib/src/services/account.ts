import { useContext, useEffect, useState, useRef } from 'react';
import { NeverminedContext } from '../nevermined';
import { useNevermined } from '../nevermined';
import { useWallet, WalletContext } from './wallet';
import { UserProfileParams } from '../types';
import { saveMarketplaceApiTokenToLocalStorage } from '../utils/marketplace_token';
import { Account } from '@nevermined-io/nevermined-sdk-js';

export const useAccountReleases = (
  id: string,
  format?: (dids: string[]) => any
): { isLoading: boolean; accountReleases: string[] } => {
  const [accountReleases, setAccountReleases] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { account } = useContext(NeverminedContext);

  useEffect(() => {
    const loadReleases = async (): Promise<void> => {
      setIsLoading(true);
      const data = await account.getReleases(id);
      setAccountReleases(data);
      if (format) {
        setAccountReleases(format(data));
      } else {
        setAccountReleases(data);
      }
      setIsLoading(false);
    };
    loadReleases();
  }, [id]);

  return { isLoading, accountReleases };
};

export const useAccountCollection = (
  id: string,
  format: (dids: string[]) => any
): { isLoading: boolean; accountCollection: string[] } => {
  const { sdk, account } = useContext(NeverminedContext);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [accountCollection, setAccountCollection] = useState<string[]>([]);

  useEffect(() => {
    const loadCollection = async (): Promise<void> => {
      if (!id || !sdk.utils) return;
      setLoading(true);
      const data = await account.getCollection(id);
      if (format) {
        setAccountCollection(format(data));
      } else {
        setAccountCollection(data);
      }
      setLoading(false);
    };
    loadCollection();
  }, [id, sdk]);

  return { isLoading, accountCollection };
};

export const useGetAccount = (): { walletAccount: Account } => {
  const { walletAddress } = useWallet();
  const { sdk } = useNevermined();
  const [walletAccount, setWalletAccount] = useState<Account>({} as Account);

  useEffect(() => {
    let accounts: Account[] = [];
    async () => {
      if (sdk.accounts) {
        accounts = await sdk.accounts.list();
        if (!accounts?.length) {
          accounts = await sdk.accounts.requestList();
        }
      }

      setWalletAccount(accounts[0]);
    };
  }, [walletAddress]);

  return {
    walletAccount
  };
};

export const useUserProfile = () => {
  const { sdk, account } = useNevermined();
  const { walletAddress } = useWallet();
  const { walletAccount } = useGetAccount();
  const [inputError, setInputError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isUpdated, setIsUpated] = useState(false);
  const [isAddressAdded, setIsAddressAdded] = useState(false);

  const [userId, setUserId] = useState('');
  const [userProfile, setUserProfile] = useState<Partial<UserProfileParams>>({
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
          const userProfileData = await sdk.profiles.findOneByAddress(walletAddress);
          setUserProfile({
            nickname: userProfileData.nickname
          });
          setUserId(userProfileData.userId);
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

export const useIsNFTHolder = (did: string): { ownNFT: boolean } => {
  const { sdk } = useNevermined();
  const { walletAddress } = useWallet();
  const { walletAccount } = useGetAccount();
  const [ownNFT, setOwnNFT] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (walletAccount) {
        const nft = await sdk.nfts.balance(did, walletAccount);
        setOwnNFT(nft >= 0);
      }
    })();
  }, [walletAddress]);

  return {
    ownNFT
  };
};
