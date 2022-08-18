import { useContext, useEffect, useState } from 'react';
import { NeverminedContext } from '../nevermined';
import { useNevermined } from '../nevermined';
import { UserProfileParams } from '../types';
import { saveMarketplaceApiTokenToLocalStorage } from '../utils/marketplace_token';
import { Account, Logger } from '@nevermined-io/nevermined-sdk-js';
import BigNumber from '@nevermined-io/nevermined-sdk-js/dist/node/utils/BigNumber';

/**
 * Get account releases(mints)
 * @param id - user address
 *
 * @example
 * ```typescript
 * const MyComponent = () => {
 *  const { isLoading, accountReleases  } = Catalog.useAccountReleases();
 *
 *  return (
 *   <>
 *      {accountReleases.map((a) => {
 *          return (
 *              <div>
 *                  <div>{a}</div>
 *              </div>
 *          )
 *      })}
 *   </>
 *  )
 * }
 * ```
 */
export const useAccountReleases = (
  id: string
): { isLoading: boolean; accountReleases: string[] } => {
  const [accountReleases, setAccountReleases] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { account } = useContext(NeverminedContext);

  useEffect(() => {
    const loadReleases = async (): Promise<void> => {
      setIsLoading(true);
      const data = await account.getReleases(id);
      setAccountReleases(data);
      setAccountReleases(data);
      setIsLoading(false);
    };
    loadReleases();
  }, [id]);

  return { isLoading, accountReleases };
};

/**
 * Get account owned nfts
 * @param id - user address
 *
 * @example
 * ```typescript
 * const MyComponent = () => {
 *  const { isLoading, accountCollection  } = Catalog.useAccountCollection(userAddr);
 *
 *  return (
 *   <>
 *      {accountCollection.map((a) => {
 *          return (
 *              <div>
 *                  <div>{a}</div>
 *              </div>
 *          )
 *      })}
 *   </>
 *  )
 * }
 * ```
 */
export const useAccountCollection = (
  id: string
): { isLoading: boolean; accountCollection: string[] } => {
  const { sdk, account } = useContext(NeverminedContext);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [accountCollection, setAccountCollection] = useState<string[]>([]);

  useEffect(() => {
    const loadCollection = async (): Promise<void> => {
      if (!id || !sdk.utils) return;
      setLoading(true);
      const data = await account.getCollection(id);
      setAccountCollection(data);
      setLoading(false);
    };
    loadCollection();
  }, [id, sdk]);

  return { isLoading, accountCollection };
};

export const useUserProfile = (walletAddress: string) => {
  const { sdk, account } = useNevermined();
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

  const checkAuth = async () => {
    if (!account.isTokenValid()) {
      setErrorMessage(
        'Your login is expired. Please first sign with your wallet before to continue'
      );
      await account.generateToken();
    }
  };

  const onAddAddress = async () => {
    try {
      let accounts = await sdk.accounts.list();
      let accountToAdd = accounts?.find((a) => a.getId() === newAddress);

      if (!accountToAdd) {
        accounts = await sdk.accounts.requestList();
        accountToAdd = accounts?.find((a) => a.getId() === newAddress);
      }

      const credential = await sdk.utils.jwt.generateClientAssertion(accountToAdd as Account);
      const token = await sdk.marketplace.addNewAddress(credential);

      saveMarketplaceApiTokenToLocalStorage({ token });
      setAddresses([...addresses, newAddress]);
      setNewAddress('');
      setIsAddressAdded(true);
      setSuccessMessage('Address is added successfully');
    } catch (error: any) {
      Logger.error(error.message);
      setErrorMessage('Error in adding new address wallet');
    }
  };

  const onSubmitUserProfile = async () => {
    try {
      await checkAuth();

      if (!userProfile.nickname) {
        setInputError('Nickname is required');
        return;
      }
      await sdk.profiles.update(userId, userProfile);
      setIsUpated(true);
      setSuccessMessage('Your profile is updated successfully');
      setInputError('');
    } catch (error: any) {
      Logger.error(error.message);
      setErrorMessage('Error in updating user profile');
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

        await checkAuth();

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
          setTimeout(async () => {
            const userProfileData = await sdk.profiles.findOneByAddress(walletAddress);
            setUserProfile({
              nickname: userProfileData.nickname
            });
            setUserId(userProfileData.userId);
          }, 1000);
        } else {
          Logger.error(error.message);
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

/**
 * This method validates if a user is a NFT (ERC-1155 based) holder for a specific `tokenId`.
 * For ERC-1155 tokens, we use the DID as tokenId. A user can between zero an multiple editions
 * of a NFT (limitted by the NFT cap).
 *
 * @param did The unique identifier of the NFT within a NFT ERC-1155 contract
 * @param walletAddress The public address of the user
 * @returns true if the user owns at least one edition of the NFT
 */
export const userIsNFT1155Holder = (
  did: string,
  walletAddress: string
): { ownNFT1155: boolean } => {
  const { sdk, isLoadingSDK } = useNevermined();
  const [ownNFT1155, setOwnNFT1155] = useState<boolean>(false);

  useEffect(() => {
    if (isLoadingSDK) {
      return;
    }

    (async () => {
      const walletAccount = new Account(walletAddress);
      if (walletAccount) {
        const balance = await sdk.nfts.balance(did, walletAccount);
        const nftBalance = BigNumber.from(balance).toNumber();
        setOwnNFT1155(nftBalance > 0);
      }
    })();
  }, [walletAddress, isLoadingSDK]);

  return {
    ownNFT1155
  };
};

// TODO: fix a bug related to how this is calculated
// See: https://github.com/nevermined-io/components-catalog/issues/128

/**
 * This method validates if a user is a NFT (ERC-721 based) holder for a specific NFT contract address.
 * For ERC-1155 tokens, we use the DID as tokenId. A user can between zero an multiple editions
 * of a NFT (limitted by the NFT cap).
 *
 * @param nftAddress The contract address of the ERC-721 NFT contract
 * @param walletAddress The public address of the user
 * @returns true if the user holds the NFT
 */
export const userIsNFT721Holder = (
  did: string,
  nftTokenAddress: string,
  walletAddress: string
): { ownNFT721: boolean } => {
  const { sdk } = useNevermined();
  const [ownNFT721, setOwnNFT721] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (walletAddress) {
        const nftOwner = await sdk.nfts.ownerOf(did, nftTokenAddress);
        setOwnNFT721(nftOwner === walletAddress);
      }
    })();
  }, [walletAddress]);

  return {
    ownNFT721
  };
};
