import React, {useEffect, useState} from 'react';
import { render, screen, renderHook, waitFor } from '@testing-library/react';
import { generateTestingUtils } from "eth-testing";
import { appConfig } from './config';
import { agreementId, ddo, walletAddress, nevermined, nftTokenAddress } from './mockups'
import Catalog from '../src';
import { DDO } from '@nevermined-io/nevermined-sdk-js';

jest.mock('@nevermined-io/nevermined-sdk-js', () => ({
  ...jest.requireActual('@nevermined-io/nevermined-sdk-js'),
  Nevermined: jest.requireActual('./mockups').nevermined,
}))

const wrapperProvider = ({children}: {children: React.ReactElement} ) => <Catalog.NeverminedProvider config={appConfig}>{children}</Catalog.NeverminedProvider>

const setup = (children: React.ReactElement) => render(
    <Catalog.NeverminedProvider config={appConfig}>
      {children}
    </Catalog.NeverminedProvider>
)


describe('Nevermined context', () => {
  const testingUtils = generateTestingUtils({ providerType: "MetaMask" });

  afterEach(() => {
    testingUtils.clearAllMocks();
    jest.clearAllMocks();
  })

  it('Component load', () => {
    testingUtils.mockConnectedWallet([walletAddress]);
    setup(<h1>Hello nevermined</h1>)
    expect(screen.getByText('Hello nevermined')).toBeInTheDocument();
  });

  it('Should get single asset', async() => {
    const { result } = renderHook(() => {
      const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined()
      const [asset, setAsset] = useState<DDO>({} as DDO)

      useEffect(() => {
        if(isLoadingSDK) {
          appConfig.web3Provider = testingUtils.getProvider();
          updateSDK(appConfig)
          return
        }

        (async() => {
          try {
            const result = await assets.getSingle(ddo.id);
            setAsset(result)
          } catch (error: any) {
            console.error(error.message)
          }
        })()
      }, [isLoadingSDK])

      return asset;
    }, {
      wrapper: wrapperProvider
    });

    await waitFor(async () => {
      expect(result.current).toStrictEqual(ddo);
    })
  });
  
  it('Should order an asset', async () => {
    const sdk = await jest.requireActual('./mockups').nevermined.getInstance();
    jest.spyOn(nevermined, 'getInstance').mockResolvedValue({
      ...sdk,
      assets: {
        resolve: async () => undefined as any,
        owner: async () => '0xdF1B443A155b07D2b2cAeA2d99715dC84E812EE2',
        order: async () => agreementId
      },
    });

    const { result } = renderHook(() => {
      const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined()
      const [agrId, setAgrId] = useState<string>('')

      useEffect(() => {
        if(isLoadingSDK) {
          appConfig.web3Provider = testingUtils.getProvider();
          updateSDK(appConfig)
          return
        }

        (async() => {
          try {
            const result = await assets.orderAsset(ddo.id);
            setAgrId(result)
          } catch (error: any) {
            console.error(error.message)
          }
        })()
      }, [isLoadingSDK])

      return agrId;
    }, {
      wrapper: wrapperProvider
    });

    await waitFor(async () => {
      expect(result.current).toBe(agreementId);
    })
  });

  it('should not order if the user is the owner of the asset', async() => {
    const sdk = await jest.requireActual('./mockups').nevermined.getInstance();
    jest.spyOn(nevermined, 'getInstance').mockResolvedValue({
      ...sdk,
      assets: {
        resolve: async () => ddo,
        owner: async () => walletAddress,
        order: async () => agreementId
      },
    });

    const { result } = renderHook(() => {
      const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined();
      const [errorMessage, setErrorMessage] = useState<string>('');

      useEffect(() => {
        if(isLoadingSDK) {
          appConfig.web3Provider = testingUtils.getProvider();
          updateSDK(appConfig)
          return
        }

        (async() => {
          try {
            await assets.orderAsset(ddo.id);
          } catch (error: any) {
            setErrorMessage(error.message)
          }
        })()
      }, [isLoadingSDK])

      return errorMessage;
    }, {
      wrapper: wrapperProvider
    });

    await waitFor(async () => {
      expect(result.current).toBe("Catalog error: You are already the owner, you don't need to order the asset");
    })
  });

  it('should get the agreement id if the asset was purchased by the user already', async() => {
    const sdk = await jest.requireActual('./mockups').nevermined.getInstance();
    jest.spyOn(nevermined, 'getInstance').mockResolvedValue({
      ...sdk,
      assets: {
        resolve: async () => ddo,
        owner: async () => '0xdF1B443A155b07D2b2cAeA2d99715dC84E812EE2',
        order: async () => agreementId
      },
    });
  
    const { result } = renderHook(() => {
      const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined()
      const [agrId, setAgrId] = useState<string>('')

      useEffect(() => {
        if(isLoadingSDK) {
          appConfig.web3Provider = testingUtils.getProvider();
          updateSDK(appConfig)
          return
        }

        (async() => {
          try {
            const result = await assets.orderAsset(ddo.id);
            setAgrId(result)
          } catch (error: any) {
            console.error(error.message)
          }
        })()
      }, [isLoadingSDK])

      return agrId;
    }, {
      wrapper: wrapperProvider
    });

    await waitFor(async () => {
      expect(result.current).toBe(agreementId);
    })
  });

  it('should get the agreement id if the nft 721 was purchased by the user already', async () => {
    const { result } = renderHook(() => {
      const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined()
      const [agrId, setAgrId] = useState<string>('')

      useEffect(() => {
        if(isLoadingSDK) {
          appConfig.web3Provider = testingUtils.getProvider();
          updateSDK(appConfig)
          return
        }

        (async() => {
          try {
            const result = await assets.orderNFT721(ddo.id, nftTokenAddress);
            setAgrId(result)
          } catch (error: any) {
            console.error(error.message)
          }
        })()
      }, [isLoadingSDK])

      return agrId;
    }, {
      wrapper: wrapperProvider
    });

    await waitFor(async () => {
      expect(result.current).toBe(agreementId);
    })
  });

  it('should order nft 721', async () => {
    const sdk = await jest.requireActual('./mockups').nevermined.getInstance();
    jest.spyOn(nevermined, 'getInstance').mockResolvedValue({
      ...sdk,
      nfts: {
        ownerOf: () => '0xdF1B443A155b07D2b2cAeA2d99715dC84E812EE2',
        balance: () => 1,
        order721: () => agreementId,
        order: () => agreementId,
        access: () => true,
      }
    });

    const { result } = renderHook(() => {
      const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined()
      const [agrId, setAgrId] = useState<string>('')

      useEffect(() => {
        if(isLoadingSDK) {
          appConfig.web3Provider = testingUtils.getProvider();
          updateSDK(appConfig)
          return
        }

        (async() => {
          try {
            const result = await assets.orderNFT721(ddo.id, nftTokenAddress);
            setAgrId(result)
          } catch (error: any) {
            console.error(error.message)
          }
        })()
      }, [isLoadingSDK])

      return agrId;
    }, {
      wrapper: wrapperProvider
    });

    await waitFor(async () => {
      expect(result.current).toBe(agreementId);
    })
  });

  it('should get the agreement id if the nft 1155 was purchased by the user already', async () => {
    const { result } = renderHook(() => {
      const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined()
      const [agrId, setAgrId] = useState<string>('')

      useEffect(() => {
        if(isLoadingSDK) {
          appConfig.web3Provider = testingUtils.getProvider();
          updateSDK(appConfig)
          return
        }

        (async() => {
          try {
            const result = await assets.orderNFT1155(ddo.id);
            setAgrId(result)
          } catch (error: any) {
            console.error(error.message)
          }
        })()
      }, [isLoadingSDK])

      return agrId;
    }, {
      wrapper: wrapperProvider
    });

    await waitFor(async () => {
      expect(result.current).toBe(agreementId);
    })
  });

  it('should order nft 1155', async () => {
    const sdk = await jest.requireActual('./mockups').nevermined.getInstance();
    jest.spyOn(nevermined, 'getInstance').mockResolvedValue({
      ...sdk,
      nfts: {
        ownerOf: () => '0xdF1B443A155b07D2b2cAeA2d99715dC84E812EE2',
        balance: () => 0,
        order721: () => agreementId,
        order: () => agreementId,
        access: () => true,
      }
    });

    const { result } = renderHook(() => {
      const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined()
      const [agrId, setAgrId] = useState<string>('')

      useEffect(() => {
        if(isLoadingSDK) {
          appConfig.web3Provider = testingUtils.getProvider();
          updateSDK(appConfig)
          return
        }

        (async() => {
          try {
            const result = await assets.orderNFT1155(ddo.id);
            setAgrId(result)
          } catch (error: any) {
            console.error(error.message)
          }
        })()
      }, [isLoadingSDK])

      return agrId;
    }, {
      wrapper: wrapperProvider
    });

    await waitFor(async () => {
      expect(result.current).toBe(agreementId);
    })
  });
})