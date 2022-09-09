import { useContext, useEffect, useState } from 'react';
import { NeverminedContext } from '../catalog';
import { useNevermined } from '../catalog';
import { UserProfileParams } from '../types';
import { saveMarketplaceApiTokenToLocalStorage } from '../utils/marketplace_token';
import { Account, Logger } from '@nevermined-io/nevermined-sdk-js';
import { loadFulfilledEvents } from '..'
import BigNumber from '@nevermined-io/nevermined-sdk-js/dist/node/utils/BigNumber';

/**
 * Get account releases(mints)
 * @param walletAddress - user address
 *
 * @example
 * ```typescript
 * const MyComponent = () => {
 *  const { isLoading, accountReleases  } = AccountService.useAccountReleases();
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
  walletAddress: string
): { isLoading: boolean; accountReleases: string[] } => {
  const [accountReleases, setAccountReleases] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { account } = useContext(NeverminedContext);

  useEffect(() => {
    const loadReleases = async (): Promise<void> => {
      setIsLoading(true);
      const data = await account.getReleases(walletAddress);
      setAccountReleases(data);
      setAccountReleases(data);
      setIsLoading(false);
    };
    loadReleases();
  }, [walletAddress]);

  return { isLoading, accountReleases };
};

/**
 * Get account owned nfts
 * @param walletAddress - user address
 *
 * @example
 * ```typescript
 * const MyComponent = () => {
 *  const { isLoading, accountCollection  } = AccountService.useAccountCollection(userAddr);
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
  walletAddress: string
): { 
  /** If the nfts are still loading */
  isLoading: boolean;
  /** All the nfts owned by the account */
  accountCollection: string[] } => {
  const { sdk, account } = useContext(NeverminedContext);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [accountCollection, setAccountCollection] = useState<string[]>([]);

  useEffect(() => {
    const loadCollection = async (): Promise<void> => {
      if (!walletAddress || !sdk.utils) return;
      setLoading(true);
      const data = await account.getCollection(walletAddress);
      setAccountCollection(data);
      setLoading(false);
    };
    loadCollection();
  }, [walletAddress, sdk]);

  return { isLoading, accountCollection };
};

/** Custom hook to handle User Profile: login, profile description, add new accounts, etc...
 * @param walletAddress Address of the wallet account
 * 
 * @example
 * Profile dashboard example:
 * ```tsx
 * import React, { useEffect, useRef } from 'react'
 * import { AccountService } from '@nevermined-io/catalog-core'
 * import { MetaMask } from '@nevermined-io/catalog-providers'
 * import {
 *   UiForm,
 *   UiFormGroup,
 *   UiFormInput,
 *   UiFormItem,
 *   Orientation,
 *   UiButton,
 *   UiLayout,
 *   UiText,
 *   UiDivider,
 *   UiPopupHandlers,
 *   NotificationPopup,
 *   BEM
 * } from '@nevermined-io/styles'
 * import { NextPage } from 'next'
 * import styles from './user-profile.module.scss'
 * 
 * const b = BEM('user-profile', styles)
 * 
 * interface AdditionalInformation {
 *   linkedinProfile: string
 * }
 * 
 * export const UserProfile: NextPage = () => {
 *   const { walletAddress } = MetaMask.useWallet()
 *   const {
 *     errorMessage,
 *     successMessage,
 *     inputError,
 *     isUpdated,
 *     isAddressAdded,
 *     setUserProfile,
 *     userProfile,
 *     addresses,
 *     newAddress,
 *     submitUserProfile,
 *     addAddress
 *   } = AccountService.useUserProfile(walletAddress)
 * 
 *   const popupRef = useRef<UiPopupHandlers>()
 * 
 *   const closePopup = (event: any) => {
 *     popupRef.current?.close()
 *     event.preventDefault()
 *   }
 * 
 *   useEffect(() => {
 *     if (errorMessage) {
 *       popupRef.current?.open()
 *     }
 *   }, [errorMessage])
 * 
 *   return (
 *     <UiLayout type="container">
 *       <NotificationPopup closePopup={closePopup} message={errorMessage} popupRef={popupRef} />
 *       <UiLayout type="container">
 *         <UiText wrapper="h1" type="h1" variants={['heading']}>
 *           User Profile account
 *         </UiText>
 *         <UiText type="h2" wrapper="h2">
 *           Update your profile
 *         </UiText>
 *       </UiLayout>
 *       <UiDivider />
 *       <UiLayout type="container">
 *         <div className={b('profile-horizontal-line')} />
 *         <UiForm>
 *           <UiFormGroup orientation={Orientation.Vertical}>
 *             <UiFormInput
 *               className={b('profile-form-input')}
 *               label="Nickname *"
 *               inputError={inputError}
 *               value={userProfile.nickname}
 *               onChange={(e) => setUserProfile({ ...userProfile, nickname: e.target.value })}
 *               placeholder="Type your nickname"
 *             />
 *           </UiFormGroup>
 *           <UiFormGroup orientation={Orientation.Vertical}>
 *             <UiFormInput
 *               className={b('profile-form-input')}
 *               label="Name"
 *               value={userProfile.name}
 *               onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
 *               placeholder="Type your name"
 *             />
 *           </UiFormGroup>
 *           <UiFormGroup orientation={Orientation.Vertical}>
 *             <UiFormInput
 *               className={b('profile-form-input')}
 *               label="Email"
 *               value={userProfile.email}
 *               onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
 *               placeholder="Type your email"
 *             />
 *           </UiFormGroup>
 *           <UiFormGroup orientation={Orientation.Vertical}>
 *             <UiFormInput
 *               className={b('profile-form-input')}
 *               label="Link Profile"
 *               placeholder="Type your link profile"
 *               value={(userProfile.additionalInformation as AdditionalInformation)?.linkedinProfile}
 *               onChange={(e) =>
 *                 setUserProfile({
 *                   ...userProfile,
 *                   additionalInformation: {
 *                     linkedinProfile: e.target.value
 *                   }
 *                 })
 *               }
 *             />
 *           </UiFormGroup>
 *           <div className={b('profile-submit-container')}>
 *             <div className={b('profile-submit-container', ['updated-message'])}>
 *               {isUpdated ? (
 *                 <UiText type="h3" wrapper="h3" variants={['success']}>
 *                   {successMessage}
 *                 </UiText>
 *               ) : null}
 *             </div>
 *             <div className={b('profile-submit-container', ['submit'])}>
 *               <UiButton onClick={submitUserProfile}>Update Profile</UiButton>
 *             </div>
 *           </div>
 *         </UiForm>
 *       </UiLayout>
 *       <UiLayout type="container" className={b('profile-addresses')}>
 *         <UiText type="h2" wrapper="h2">
 *           Addresses
 *         </UiText>
 *         <div className={b('profile-horizontal-line')} />
 *         <UiForm>
 *           <div>
 *             <UiText type="h3">Current Addresses</UiText>
 *           </div>
 *           <div>
 *             <UiText variants={['detail']}>
 *               Change your wallet account to add more address to your profile
 *             </UiText>
 *           </div>
 * 
 *           <div className={b('profile-current-addresses-container')}>
 *             {addresses.map((a) => (
 *               <div key={a} className={b('profile-current-address')}>
 *                 {a}
 *               </div>
 *             ))}
 *           </div>
 * 
 *           {newAddress && (
 *             <UiFormGroup orientation={Orientation.Vertical} className={b('profile-add-address')}>
 *               <UiFormItem
 *                 label="Add new address"
 *                 value={newAddress}
 *                 onClick={addAddress}
 *                 disabled={true}
 *               />
 *             </UiFormGroup>
 *           )}
 * 
 *           <div className={b('profile-submit-container')}>
 *             <div className={b('profile-submit-container', ['updated-message'])}>
 *               {isAddressAdded ? (
 *                 <UiText type="h3" wrapper="h3" variants={['success']}>
 *                   {successMessage}
 *                 </UiText>
 *               ) : null}
 *             </div>
 *           </div>
 *         </UiForm>
 *       </UiLayout>
 *     </UiLayout>
 *   )
 * }
 * ```
 * 
 * @see {@link https://github.com/nevermined-io/defi-marketplace/blob/main/client/src/%2Bassets/user-profile.tsx}
 */
export const useUserProfile = (walletAddress: string): {
  /** Input error message */
  inputError: string,
  /** Error messages that come from sdk*/
  errorMessage: string,
  /** Success messages */
  successMessage: string,
  /** If profile is updated */
  isUpdated: boolean,
  /** If new address is added */
  isAddressAdded: boolean,
  /** User profile parameters */
  userProfile: Partial<UserProfileParams>,
  /** Addresses wallet accounts included in the user profile */
  addresses: string[],
  /** New address to add in the user profile */
  newAddress: string,
  /** Set parameters to user profile */
  setUserProfile: React.Dispatch<React.SetStateAction<Partial<UserProfileParams>>>,
  /** Add new address */
  addAddress: () => Promise<void>,
  /** Submit user profile */
  submitUserProfile: () => Promise<void>
} => {
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

  const addAddress = async () => {
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

  const submitUserProfile = async () => {
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
    addAddress,
    submitUserProfile
  };
};

/**
 * This method validates if an user is an asset holder.
 *
 * @param did The unique identifier of the asset
 * @param walletAddress The public address of the user
 * @returns true if the user owns at least one edition of the NFT
 */
export const useIsAssetHolder = (
  did: string,
  walletAddress: string
): { ownAsset: boolean } => {
  const { sdk, isLoadingSDK } = useNevermined();
  const [ownAsset, setOwnAsset] = useState<boolean>(false);

  useEffect(() => {
    if (isLoadingSDK) {
      return;
    }

    (async () => {
      const purchased = await loadFulfilledEvents(sdk, walletAddress, 'accessCondition');

      const purchasedDDO = await Promise.all(
        purchased.map((asset) => sdk.assets.resolve(asset.documentId))
      );

      const asset = purchasedDDO.filter((p) => p).find((p) => p.id === did);
      setOwnAsset(Boolean(asset));
    })();
  }, [walletAddress, isLoadingSDK]);

  return {
    ownAsset,
  }
}

/**
 * This method validates if a user is a NFT (ERC-1155 based) holder for a specific `tokenId`.
 * For ERC-1155 tokens, we use the DID as tokenId. A user can between zero an multiple editions
 * of a NFT (limitted by the NFT cap).
 *
 * @param did The unique identifier of the NFT within a NFT ERC-1155 contract
 * @param walletAddress The public address of the user
 * @returns true if the user owns at least one edition of the NFT
 */
export const useIsNFT1155Holder = (
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
export const useIsNFT721Holder = (
  nftAddress: string,
  walletAddress: string
): { ownNFT721: boolean } => {
  const { sdk, isLoadingSDK } = useNevermined();
  const [ownNFT721, setOwnNFT721] = useState<boolean>(false);

  useEffect(() => {
    if (isLoadingSDK) {
      return;
    }

    (async () => {
      const walletAccount = new Account(walletAddress);
      if (walletAccount) {     
        const nft721 = await sdk.contracts.loadNft721(nftAddress)
        const balance = await nft721.balanceOf(walletAccount)
        setOwnNFT721(balance.gt(0))
      }
    })();
  }, [walletAddress, isLoadingSDK]);

  return {
    ownNFT721
  };
};
