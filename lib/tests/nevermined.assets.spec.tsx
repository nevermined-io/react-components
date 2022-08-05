import React, { useEffect, useState } from 'react';
import { render, screen, renderHook, waitFor } from '@testing-library/react';
import { generateTestingUtils } from 'eth-testing';
import { appConfig } from './config';
import { agreementId, ddo, walletAddress, nevermined, nftTokenAddress } from './mockups';
import Catalog from '../src';
import { DDO } from '@nevermined-io/nevermined-sdk-js';

jest.mock('@nevermined-io/nevermined-sdk-js', () => ({
  ...jest.requireActual('@nevermined-io/nevermined-sdk-js'),
  Nevermined: jest.requireActual('./mockups').nevermined
}));

const wrapperProvider = ({ children }: { children: React.ReactElement }) => (
  <Catalog.NeverminedProvider config={appConfig}>{children}</Catalog.NeverminedProvider>
);

const setup = (children: React.ReactElement) =>
  render(<Catalog.NeverminedProvider config={appConfig}>{children}</Catalog.NeverminedProvider>);

describe('Nevermined assets', () => {
  const testingUtils = generateTestingUtils({ providerType: 'MetaMask' });

  afterEach(() => {
    testingUtils.clearAllMocks();
    jest.clearAllMocks();
  });

  it('Component load', () => {
    testingUtils.mockConnectedWallet([walletAddress]);
    setup(<h1>Hello nevermined</h1>);
    expect(screen.getByText('Hello nevermined')).toBeInTheDocument();
  });

  it('Should get single asset', async () => {
    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined();
        const [asset, setAsset] = useState<DDO>({} as DDO);

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

          (async () => {
            try {
              const result = await assets.getSingle(ddo.id);
              setAsset(result);
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [isLoadingSDK]);

        return asset;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(async () => {
      expect(result.current).toStrictEqual(ddo);
    });
  });

  it('Should order an asset', async () => {
    const sdk = await jest.requireActual('./mockups').nevermined.getInstance();
    jest.spyOn(nevermined, 'getInstance').mockResolvedValue({
      ...sdk,
      assets: {
        resolve: async () => undefined as any,
        owner: async () => '0xdF1B443A155b07D2b2cAeA2d99715dC84E812EE2',
        order: async () => agreementId,
        download: async () => true,
        consume: async () => true
      }
    });

    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined();
        const [agrId, setAgrId] = useState<string>('');

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

          (async () => {
            try {
              const result = await assets.orderAsset(ddo.id);
              setAgrId(result);
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [isLoadingSDK]);

        return agrId;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(async () => {
      expect(result.current).toBe(agreementId);
    });
  });

  it('should not order if the user is the owner of the asset', async () => {
    const sdk = await jest.requireActual('./mockups').nevermined.getInstance();
    jest.spyOn(nevermined, 'getInstance').mockResolvedValue({
      ...sdk,
      assets: {
        resolve: async () => ddo,
        owner: async () => walletAddress,
        order: async () => agreementId,
        download: async () => true,
        consume: async () => true
      }
    });

    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined();
        const [errorMessage, setErrorMessage] = useState<string>('');

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

          (async () => {
            try {
              await assets.orderAsset(ddo.id);
            } catch (error: any) {
              setErrorMessage(error.message);
            }
          })();
        }, [isLoadingSDK]);

        return errorMessage;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(async () => {
      expect(result.current).toBe(
        "Catalog error: You are already the owner, you don't need to order the asset"
      );
    });
  });

  it('should get the agreement id if the asset was purchased by the user already', async () => {
    const sdk = await jest.requireActual('./mockups').nevermined.getInstance();
    jest.spyOn(nevermined, 'getInstance').mockResolvedValue({
      ...sdk,
      assets: {
        resolve: async () => ddo,
        owner: async () => '0xdF1B443A155b07D2b2cAeA2d99715dC84E812EE2',
        order: async () => agreementId,
        download: async () => true,
        consume: async () => true
      }
    });

    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined();
        const [agrId, setAgrId] = useState<string>('');

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

          (async () => {
            try {
              const result = await assets.orderAsset(ddo.id);
              setAgrId(result);
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [isLoadingSDK]);

        return agrId;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(async () => {
      expect(result.current).toBe(agreementId);
    });
  });

  it('should get the agreement id if the nft 721 was purchased by the user already', async () => {
    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined();
        const [agrId, setAgrId] = useState<string>('');

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

          (async () => {
            try {
              const result = await assets.orderNFT721(ddo.id, nftTokenAddress);
              setAgrId(result);
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [isLoadingSDK]);

        return agrId;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(async () => {
      expect(result.current).toBe(agreementId);
    });
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
        access: () => true
      }
    });

    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined();
        const [agrId, setAgrId] = useState<string>('');

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

          (async () => {
            try {
              const result = await assets.orderNFT721(ddo.id, nftTokenAddress);
              setAgrId(result);
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [isLoadingSDK]);

        return agrId;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(async () => {
      expect(result.current).toBe(agreementId);
    });
  });

  it('should get the agreement id if the nft 1155 was purchased by the user already', async () => {
    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined();
        const [agrId, setAgrId] = useState<string>('');

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

          (async () => {
            try {
              const result = await assets.orderNFT1155(ddo.id);
              setAgrId(result);
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [isLoadingSDK]);

        return agrId;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(async () => {
      expect(result.current).toBe(agreementId);
    });
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
        access: () => true
      }
    });

    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined();
        const [agrId, setAgrId] = useState<string>('');

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

          (async () => {
            try {
              const result = await assets.orderNFT1155(ddo.id);
              setAgrId(result);
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [isLoadingSDK]);

        return agrId;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(async () => {
      expect(result.current).toBe(agreementId);
    });
  });

  it('should download asset if the user is the owner', async () => {
    const sdk = await jest.requireActual('./mockups').nevermined.getInstance();
    const sdkSpy = jest.spyOn(nevermined, 'getInstance');

    sdkSpy.mockResolvedValue({
      ...sdk,
      assets: {
        resolve: async () => ddo,
        owner: async () => walletAddress,
        order: async () => agreementId,
        download: async () => true,
        consume: async () => true
      }
    });

    const sdkInstance: any = await sdkSpy.getMockImplementation()?.();

    const downloadSpy = jest.spyOn(sdkInstance.assets, 'download');
    const consumeSpy = jest.spyOn(sdkInstance.assets, 'consume');

    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined();
        const [isDownloaded, setIsDownloaded] = useState<boolean>(false);

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

          (async () => {
            try {
              const result = await assets.downloadAsset(ddo.id, agreementId);
              setIsDownloaded(result);
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [isLoadingSDK]);

        return isDownloaded;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(async () => {
      expect(result.current).toBe(true);
    });

    expect(downloadSpy).toBeCalled();
    expect(consumeSpy).not.toBeCalled();
  });

  it('should consume the asset if the user is not the owner', async () => {
    const sdk = await jest.requireActual('./mockups').nevermined.getInstance();
    const sdkSpy = jest.spyOn(nevermined, 'getInstance');

    sdkSpy.mockResolvedValue({
      ...sdk,
      assets: {
        resolve: async () => ddo,
        owner: async () => '0xdF1B443A155b07D2b2cAeA2d99715dC84E812EE2',
        order: async () => agreementId,
        download: async () => true,
        consume: async () => true
      }
    });

    const sdkInstance: any = await sdkSpy.getMockImplementation()?.();

    const downloadSpy = jest.spyOn(sdkInstance.assets, 'download');
    const consumeSpy = jest.spyOn(sdkInstance.assets, 'consume');

    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined();
        const [isDownloaded, setIsDownloaded] = useState<boolean>(false);

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

          (async () => {
            try {
              const result = await assets.downloadAsset(ddo.id, agreementId);
              setIsDownloaded(result);
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [isLoadingSDK]);

        return isDownloaded;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(async () => {
      expect(result.current).toBe(true);
    });

    expect(downloadSpy).not.toBeCalled();
    expect(consumeSpy).toBeCalled();
  });

  it('should download the nft', async () => {
    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined();
        const [isDownloaded, setIsDownloaded] = useState<boolean>(false);

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

          (async () => {
            try {
              const result = await assets.downloadNFT(ddo.id);
              setIsDownloaded(result);
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [isLoadingSDK]);

        return isDownloaded;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(async () => {
      expect(result.current).toBe(true);
    });
  });

  it('should get details of a custom erc20 token', async () => {
    interface CustomErc20Token {
      name: string;
      symbol: string;
      decimals: number;
      balance: unknown;
    }

    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined();
        const [customErc20Token, setCustomErc20Token] = useState({} as CustomErc20Token);

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider();
            updateSDK(appConfig);
            return;
          }

          (async () => {
            try {
              const result = await assets.getCustomErc20Token(
                '0xdF1B443A155b07D2b2cAeA2d99715dC84E812EE2'
              );
              setCustomErc20Token({ ...result });
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [isLoadingSDK]);

        return customErc20Token;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(async () => {
      expect(result.current).toStrictEqual({
        name: 'Nevermined',
        symbol: 'NVM',
        decimals: 18,
        balance: 1500000000000000000
      });
    });
  });
});
