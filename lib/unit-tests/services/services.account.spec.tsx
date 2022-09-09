import React, { useEffect, useState } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { generateTestingUtils } from 'eth-testing';
import { appConfig } from '../config';
import { Catalog, AccountService } from '../../src';
import { ddo, walletAddress, walletAddress2, profileResult, nevermined, newProfile, updatedProfile } from '../mockups';

jest.mock('@nevermined-io/nevermined-sdk-js', () => ({
  ...jest.requireActual('@nevermined-io/nevermined-sdk-js'),
  Nevermined: jest.requireActual('../mockups').nevermined
}));

const wrapperProvider = ({ children }: { children: React.ReactElement }) => (
  <Catalog.NeverminedProvider config={appConfig}>{children}</Catalog.NeverminedProvider>
);

describe('Account Service', () => {
  const testingUtils = generateTestingUtils({ providerType: 'MetaMask' });

  afterEach(() => {
    testingUtils.clearAllMocks();
    jest.clearAllMocks();
  });

  it('should get all the asset publised from the address passed by argument', async () => {
    const { result } = renderHook(
      () => {
        const { isLoadingSDK, updateSDK, account } = Catalog.useNevermined();
        const { accountReleases } = AccountService.useAccountReleases(walletAddress)
        const [ releases, setReleases ] = useState<string[]>([]);

        jest.spyOn(account, 'getReleases').mockResolvedValue([ddo.id])

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

          (async () => {
            try {
              setReleases(accountReleases)
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [isLoadingSDK, accountReleases]);

        return releases;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(() => {
      expect(result.current).toStrictEqual([ddo.id]);
    });
  });

  it('should get the assets bought by the address given', async () => {
    const { result } = renderHook(
      () => {
        const { isLoadingSDK, updateSDK, account } = Catalog.useNevermined();
        const { accountCollection } = AccountService.useAccountCollection(walletAddress)
        const [ collection, setCollection ] = useState<string[]>([]);

        jest.spyOn(account, 'getCollection').mockResolvedValue([ddo.id])

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

          (async () => {
            try {
              setCollection(accountCollection)
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [isLoadingSDK, accountCollection]);

        return collection;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(() => {
      expect(result.current).toStrictEqual([ddo.id]);
    });
  });

  it('should add new address', async () => {
    const sdk = await jest.requireActual('../mockups').nevermined.getInstance();
    const { result } = renderHook(
      () => {
        const { isLoadingSDK, updateSDK } = Catalog.useNevermined();
        const [wallet, setWallet] = useState<string>(walletAddress);
        const { addresses, addAddress, newAddress } = AccountService.useUserProfile(wallet);

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

          (async () => {
            try {
              jest.spyOn(nevermined, 'getInstance').mockResolvedValue({
                ...sdk,
                profiles: {
                  ...sdk.profiles,
                  findOneByAddress: async () => {
                    throw new Error('Profile cannot be found');
                  }
                }
              });

              setWallet(walletAddress2);
              if(newAddress && addresses.length < 2) addAddress();
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [isLoadingSDK, wallet, newAddress]);

        return addresses;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(() => {
      expect(result.current).toStrictEqual([walletAddress, walletAddress2]);
    }, {
      timeout: 5000
    });
  });

  it("should get a user Profile", async () => {
    const sdk = await jest.requireActual('../mockups').nevermined.getInstance();
    jest.spyOn(nevermined, 'getInstance').mockResolvedValue({
      ...sdk,
      profiles: {
        ...sdk.profiles,
        findOneByAddress: async () => newProfile
      }
    });

    const { result } = renderHook(
      () => {
        const { isLoadingSDK, updateSDK } = Catalog.useNevermined();
        const { userProfile } = AccountService.useUserProfile(walletAddress)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

        }, [isLoadingSDK, userProfile]);

        return userProfile;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(() => {
      expect(result.current).toStrictEqual(profileResult);
    });
  });

  it('should request list if get list does not return any address', async () => {
    const sdk = await jest.requireActual('../mockups').nevermined.getInstance();
    const sdkSpy = jest.spyOn(nevermined, 'getInstance');

    sdkSpy.mockResolvedValue({
      ...sdk,
      profiles: {
        ...sdk.profiles,
        findOneByAddress: async () => newProfile
      },
      accounts: {
        ...sdk.accounts,
        list: () => [],
      }
    });

    const sdkInstance: any = await sdkSpy.getMockImplementation()?.();

    const requestListSpy = jest.spyOn(sdkInstance.accounts, 'requestList')

    renderHook(
      () => {
        const { isLoadingSDK, updateSDK } = Catalog.useNevermined();
        const [wallet, setWallet] = useState<string>(walletAddress);
        const { addresses, addAddress, newAddress } = AccountService.useUserProfile(wallet);

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

          (async () => {
            try {
              setWallet(walletAddress2);
              if(!addresses.length && wallet === walletAddress2) addAddress();
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [isLoadingSDK, wallet, newAddress]);

        return addresses;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(() => {
      expect(requestListSpy).toBeCalledTimes(1);
    }, {
      timeout: 5000
    });
  });

  it('should throw an error if profile is not found', async () => {
    const sdk = await jest.requireActual('../mockups').nevermined.getInstance();
    const sdkSpy = jest.spyOn(nevermined, 'getInstance');

    sdkSpy.mockResolvedValue({
      ...sdk,
      profiles: {
        ...sdk.profiles,
        findOneByAddress: async () => {
          throw new Error('"statusCode":404')
        }
      },
      accounts: {
        ...sdk.accounts,
        list: () => [walletAddress],
      }
    });

    const sdkInstance: any = await sdkSpy.getMockImplementation()?.();

    const generateTokenSpy = jest.spyOn(sdkInstance.marketplace, 'login')

    renderHook(
      () => {
        const { isLoadingSDK, updateSDK } = Catalog.useNevermined();
        const [wallet] = useState<string>(walletAddress);
        const { errorMessage } = AccountService.useUserProfile(wallet);

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }
        }, [isLoadingSDK, errorMessage]);
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(() => {
      expect(generateTokenSpy).toBeCalledTimes(1);
    }, {
      timeout: 5000
    });
  });

  it('should throw error if user is not logged', async () => {
    const sdk = await jest.requireActual('../mockups').nevermined.getInstance();
    jest.spyOn(nevermined, 'getInstance').mockResolvedValue({
      ...sdk,
      profiles: {
        ...sdk.profiles,
        findOneByAddress: async () => newProfile
      }
    });

    const { result } = renderHook(
      () => {
        const { isLoadingSDK, updateSDK, account } = Catalog.useNevermined();
        const { errorMessage } = AccountService.useUserProfile(walletAddress);

        jest.spyOn(account, 'isTokenValid').mockReturnValue(false)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

        }, [isLoadingSDK, errorMessage]);

        return errorMessage;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(() => {
      expect(result.current).toStrictEqual('Your login is expired. Please first sign with your wallet before to continue');
    });
  });


  it('Should submit a profile', async () => {
    const { result } = renderHook(
      () => {
        const { isLoadingSDK, updateSDK } = Catalog.useNevermined();
        const { submitUserProfile, setUserProfile, userProfile } = AccountService.useUserProfile(walletAddress);

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

          (async () => {
            try {
              setUserProfile(updatedProfile as any)
              await submitUserProfile()
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [isLoadingSDK, userProfile]);

        return userProfile;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(() => {
      expect(result.current).toStrictEqual(updatedProfile);
    });
  });

  it('Should throw an error if profile is submitted without nickname', async() => {
    const updatedProfileCopy = {...updatedProfile};
    updatedProfileCopy.nickname = '';

    const { result } = renderHook(
      () => {
        const { isLoadingSDK, updateSDK, account } = Catalog.useNevermined();
        const { submitUserProfile, setUserProfile, inputError } = AccountService.useUserProfile(walletAddress);
        jest.spyOn(account, 'isTokenValid').mockReturnValue(true)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

          (async () => {
            try {
              setUserProfile(updatedProfileCopy as any)
              await submitUserProfile()
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [isLoadingSDK, inputError]);

        return inputError;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(() => {
      expect(result.current).toStrictEqual('Nickname is required');
    });
  });

  it('should return true as an asset holder', async () => {
    const { result } = renderHook(
      () => {
        const { isLoadingSDK, updateSDK } = Catalog.useNevermined();
        const { ownAsset } = AccountService.useIsAssetHolder(ddo.id, walletAddress);

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

        }, [isLoadingSDK, ownAsset]);

        return ownAsset;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(() => {
      expect(result.current).toStrictEqual(true);
    });
  });

  it('should return false as an asset holder', async () => {
    const sdk = await jest.requireActual('../mockups').nevermined.getInstance();
    jest.spyOn(nevermined, 'getInstance').mockResolvedValue({
      ...sdk,
      keeper: {
        ...sdk.keeper,
        templates: {
          ...sdk.keeper.templates,
          accessTemplate: {
            events: {
              getPastEvents: async () => [],
            }
          }
        }
      }
    });

    const { result } = renderHook(
      () => {
        const { isLoadingSDK, updateSDK } = Catalog.useNevermined();
        const { ownAsset } = AccountService.useIsAssetHolder(ddo.id, walletAddress);

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

        }, [isLoadingSDK, ownAsset]);

        return ownAsset;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(() => {
      expect(result.current).toStrictEqual(false);
    });
  });

  it('should return true as a nft721 holder', async () => {
    const { result } = renderHook(
      () => {
        const { isLoadingSDK, updateSDK } = Catalog.useNevermined();
        const { ownNFT721 } = AccountService.useIsNFT721Holder(ddo.id, walletAddress);

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

        }, [isLoadingSDK, ownNFT721]);

        return ownNFT721;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(() => {
      expect(result.current).toStrictEqual(true);
    });
  });

  it('should return false as a nft721 holder', async () => {
    const sdk = await jest.requireActual('../mockups').nevermined.getInstance();
    jest.spyOn(nevermined, 'getInstance').mockResolvedValue({
      ...sdk,
      contracts: {
        ...sdk.contracts,
        loadNft721: async () => ({
          balanceOf: async () => ({
            gt: () => false,
          })
        })
      }
    });

    const { result } = renderHook(
      () => {
        const { isLoadingSDK, updateSDK } = Catalog.useNevermined();
        const { ownNFT721 } = AccountService.useIsNFT721Holder(ddo.id, walletAddress);

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

        }, [isLoadingSDK, ownNFT721]);

        return ownNFT721;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(() => {
      expect(result.current).toStrictEqual(false);
    });
  });

  it('should return true as a nft1155 holder', async () => {
    const { result } = renderHook(
      () => {
        const { isLoadingSDK, updateSDK } = Catalog.useNevermined();
        const { ownNFT1155 } = AccountService.useIsNFT1155Holder(ddo.id, walletAddress);

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

        }, [isLoadingSDK, ownNFT1155]);

        return ownNFT1155;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(() => {
      expect(result.current).toStrictEqual(true);
    });
  });

  it('should return false as a nft1155 holder', async () => {
    const sdk = await jest.requireActual('../mockups').nevermined.getInstance();
    jest.spyOn(nevermined, 'getInstance').mockResolvedValue({
      ...sdk,
      nfts: {
        ...sdk.ntfs,
        balance: () => 0
      }
    });

    const { result } = renderHook(
      () => {
        const { isLoadingSDK, updateSDK } = Catalog.useNevermined();
        const { ownNFT1155 } = AccountService.useIsNFT1155Holder(ddo.id, walletAddress);

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

        }, [isLoadingSDK, ownNFT1155]);

        return ownNFT1155;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(() => {
      expect(result.current).toStrictEqual(false);
    });
  });
});