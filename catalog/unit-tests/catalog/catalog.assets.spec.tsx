import React, { useEffect, useState } from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { generateTestingUtils } from 'eth-testing'
import { appConfig } from '../config'
import { agreementId, ddo, walletAddress, nevermined, nftTokenAddress } from '../mockups'
import { Catalog, NFTDetails, BigNumber } from '../../src'
import { DDO, Logger } from '@nevermined-io/sdk'

jest.mock('@nevermined-io/sdk', () => ({
  ...jest.requireActual('@nevermined-io/sdk'),
  Nevermined: jest.requireActual('../mockups').nevermined
}))

jest.mock('axios', () => ({
  post: () => ({
    data: {
      url: 'cid://bafkqaesimvwgy3zmebhgk5tfojwws3tfmqqq'
    }
  })
}))

jest.mock('axios-retry', () => () => undefined)

const wrapperProvider = ({ children }: { children: React.ReactElement }) => (
  <Catalog.NeverminedProvider config={appConfig}>{children}</Catalog.NeverminedProvider>
)

describe('Nevermined assets', () => {
  const testingUtils = generateTestingUtils({ providerType: 'MetaMask' })

  afterEach(() => {
    testingUtils.clearAllMocks()
    jest.clearAllMocks()
  })

  it('Should get single asset', async () => {
    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const [asset, setAsset] = useState<DDO>({} as DDO)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const result = await assets.findOne(ddo.id)
              setAsset(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return asset
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toStrictEqual(ddo)
    })
  })

  it('Should get an asset by passing a query', async () => {
    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const [asset, setAsset] = useState<DDO[]>([])

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const result = await assets.query({
                query: {
                  id: ddo.id
                }
              })
              
              setAsset(result.results)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return asset
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toStrictEqual([ddo])
    })
  })

  it('Should order an asset', async () => {
    const sdk = await jest.requireActual('../mockups').nevermined.getInstance()
    jest.spyOn(nevermined, 'getInstance').mockResolvedValue({
      ...sdk,
      assets: {
        ...sdk.assets,
        resolve: async () => undefined as any,
        owner: async () => '0xdF1B443A155b07D2b2cAeA2d99715dC84E812EE2',
        order: async () => agreementId,
        download: async () => true,
        consume: async () => true
      }
    })

    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK, sdk } = Catalog.useNevermined()
        const [agrId, setAgrId] = useState<string>('')

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const [userAccount] = await sdk.accounts.list()
              const result = await assets.orderAsset(ddo.id, userAccount)
              setAgrId(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return agrId
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toBe(agreementId)
    })
  })

  it('should not order if the user is the owner of the asset', async () => {
    const sdk = await jest.requireActual('../mockups').nevermined.getInstance()
    jest.spyOn(nevermined, 'getInstance').mockResolvedValue({
      ...sdk,
      assets: {
        ...sdk.assets,
        resolve: async () => ddo,
        owner: async () => walletAddress,
        order: async () => agreementId,
        download: async () => true,
        consume: async () => true
      }
    })

    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK, sdk } = Catalog.useNevermined()
        const [errorMessage, setErrorMessage] = useState<string>('')

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const [userAccount] = await sdk.accounts.list()
              await assets.orderAsset(ddo.id, userAccount)
            } catch (error: any) {
              setErrorMessage(error.message)
            }
          })()
        }, [isLoadingSDK])

        return errorMessage
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toBe(
        "Catalog error: You are already the owner, you don't need to order the asset"
      )
    })
  })

  it('should get the agreement id if the asset was purchased by the user already', async () => {
    const sdk = await jest.requireActual('../mockups').nevermined.getInstance()
    jest.spyOn(nevermined, 'getInstance').mockResolvedValue({
      ...sdk,
      assets: {
        ...sdk.assets,
        resolve: async () => ddo,
        owner: async () => '0xdF1B443A155b07D2b2cAeA2d99715dC84E812EE2',
        order: async () => agreementId,
        download: async () => true,
        consume: async () => true
      }
    })

    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK, sdk } = Catalog.useNevermined()
        const [agrId, setAgrId] = useState<string>('')

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const [userAccount] = await sdk.accounts.list()
              const result = await assets.orderAsset(ddo.id, userAccount)
              setAgrId(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return agrId
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toBe(agreementId)
    })
  })

  it('should get the agreement id if the nft 721 was purchased by the user already', async () => {
    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK, sdk } = Catalog.useNevermined()
        const [agrId, setAgrId] = useState<string>('')

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const [userAccount] = await sdk.accounts.list()
              const result = await assets.orderNFT721(ddo.id, userAccount, nftTokenAddress)
              setAgrId(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return agrId
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toBe(agreementId)
    })
  })

  it('should order nft 721', async () => {
    const sdk = await jest.requireActual('../mockups').nevermined.getInstance()
    jest.spyOn(nevermined, 'getInstance').mockResolvedValue({
      ...sdk,
      nfts: {
        ...sdk.nfts,
        ownerOf: () => '0xdF1B443A155b07D2b2cAeA2d99715dC84E812EE2',
        balance: () => 1,
        order721: () => agreementId,
        order: () => agreementId,
        access: () => true
      }
    })

    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK, sdk } = Catalog.useNevermined()
        const [agrId, setAgrId] = useState<string>('')

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const [userAccount] = await sdk.accounts.list()
              const result = await assets.orderNFT721(ddo.id, userAccount, nftTokenAddress)
              setAgrId(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return agrId
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toBe(agreementId)
    })
  })

  it('should get the agreement id if the nft 1155 was purchased by the user already', async () => {
    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK, sdk } = Catalog.useNevermined()
        const [agrId, setAgrId] = useState<string>('')

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const [consumer] = await sdk.accounts.list()
              const result = await assets.orderNFT1155(ddo.id, BigNumber.from(1), consumer)
              setAgrId(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return agrId
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toBe(agreementId)
    })
  })

  it('should order nft 1155', async () => {
    const sdk = await jest.requireActual('../mockups').nevermined.getInstance()
    jest.spyOn(nevermined, 'getInstance').mockResolvedValue({
      ...sdk,
      nfts: {
        ...sdk.nfts,
        ownerOf: () => '0xdF1B443A155b07D2b2cAeA2d99715dC84E812EE2',
        balance: () => 0,
        order721: () => agreementId,
        order: () => agreementId,
        access: () => true
      }
    })

    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK, sdk } = Catalog.useNevermined()
        const [agrId, setAgrId] = useState<string>('')

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const [consumer] = await sdk.accounts.list()
              const result = await assets.orderNFT1155(ddo.id, BigNumber.from(1), consumer)
              setAgrId(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return agrId
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toBe(agreementId)
    })
  })

  it('should download asset if the user is the owner', async () => {
    const sdk = await jest.requireActual('../mockups').nevermined.getInstance()
    const sdkSpy = jest.spyOn(nevermined, 'getInstance')

    sdkSpy.mockResolvedValue({
      ...sdk,
      assets: {
        ...sdk.assets,
        resolve: async () => ddo,
        owner: async () => walletAddress,
        order: async () => agreementId,
        download: async () => true,
      }
    })

    const sdkInstance: any = await sdkSpy.getMockImplementation()?.()

    const downloadSpy = jest.spyOn(sdkInstance.assets, 'download')
    const accessSpy = jest.spyOn(sdkInstance.assets, 'access')

    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK, sdk } = Catalog.useNevermined()
        const [isDownloaded, setIsDownloaded] = useState<boolean>(false)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const [consumer] = await sdk.accounts.list()
              const result = await assets.downloadAsset({did: ddo.id, consumer})
              setIsDownloaded(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return isDownloaded
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toBe(true)
    })

    expect(downloadSpy).toBeCalled()
    expect(accessSpy).not.toBeCalled()
  })

  it('should access the asset if the user is not the owner', async () => {
    const sdk = await jest.requireActual('../mockups').nevermined.getInstance()
    const sdkSpy = jest.spyOn(nevermined, 'getInstance')

    sdkSpy.mockResolvedValue({
      ...sdk,
      assets: {
        ...sdk.assets,
        resolve: async () => ddo,
        owner: async () => '0xdF1B443A155b07D2b2cAeA2d99715dC84E812EE2',
        order: async () => agreementId,
        download: async () => true,
        access: async () => true
      }
    })

    const sdkInstance: any = await sdkSpy.getMockImplementation()?.()

    const downloadSpy = jest.spyOn(sdkInstance.assets, 'download')
    const accessSpy = jest.spyOn(sdkInstance.assets, 'access')

    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK, sdk } = Catalog.useNevermined()
        const [isDownloaded, setIsDownloaded] = useState<boolean>(false)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const [consumer] = await sdk.accounts.list()
              const result = await assets.downloadAsset({ did: ddo.id, consumer})
              setIsDownloaded(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return isDownloaded
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toBe(true)
    })

    expect(downloadSpy).not.toBeCalled()
    expect(accessSpy).toBeCalled()
  })

  it('should download the nft', async () => {
    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK, sdk } = Catalog.useNevermined()
        const [isDownloaded, setIsDownloaded] = useState<boolean>(false)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const [consumer] = await sdk.accounts.list()
              const result = await assets.downloadNFT({did: ddo.id, consumer})
              setIsDownloaded(result as boolean)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return isDownloaded
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toBe(true)
    })
  })

  it('should get details of a custom erc20 token', async () => {
    interface CustomErc20Token {
      name: string;
      symbol: string;
      decimals: number;
      balance: unknown;
    }

    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const [customErc20Token, setCustomErc20Token] = useState({} as CustomErc20Token)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const result = await assets.getCustomErc20Token(
                '0xdF1B443A155b07D2b2cAeA2d99715dC84E812EE2',
                walletAddress
              )
              setCustomErc20Token({ ...result })
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return customErc20Token
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toStrictEqual({
        name: 'Nevermined',
        symbol: 'NVM',
        decimals: 18,
        balance: 1500000000000000000
      })
    })
  })

  it('should upload an asset to filecoin', async() => {
    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const [filecoinUrl, setFileCoinUrl] = useState('')

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const blob = new Blob(['Hello! Nevermined'], {
                type: 'text'
              })

              const file = new File([blob], 'Nevermined test')

              const response = await assets.uploadAssetToFilecoin(file, 'cid://')
              setFileCoinUrl(response)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return filecoinUrl
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toBe('cid://bafkqaesimvwgy3zmebhgk5tfojwws3tfmqqq')
    })
  })

  it('should transfer the ownership to other account', async () => {
    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK, sdk } = Catalog.useNevermined()
        const [transfered, setTransfered] = useState<boolean>(false)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const [userAccount] = await sdk.accounts.list()
              const result = await assets.transfer({
                did: ddo.id,
                amount: 1,
                ercType: 1155,
                newOwner: userAccount
              })
              setTransfered(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return transfered
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toBe(true)
    }, {
      timeout: 5000
    })
  })

  it('Should request approval for transfer ownership to other account', async () => {
    const sdk = await jest.requireActual('../mockups').nevermined.getInstance()
    const sdkSpy = jest.spyOn(nevermined, 'getInstance')

    sdkSpy.mockResolvedValue({
      ...sdk,
      keeper: {
        ...sdk.keeper,
        nftUpgradeable: {
          isApprovedForAll: () => false
        }
      },
    })

    const sdkInstance: any = await sdkSpy.getMockImplementation()?.()

    const setApprovalForAllSpy = jest.spyOn(sdkInstance.nfts1155, 'setApprovalForAll')

    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK, sdk } = Catalog.useNevermined()
        const [transfered, setTransfered] = useState<boolean>(false)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const [userAccount] = await sdk.accounts.list()
              const result = await assets.transfer({
                did: ddo.id,
                amount: 1,
                ercType: 1155,
                newOwner: userAccount
              })
              setTransfered(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return transfered
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toBe(true)
    }, {
      timeout: 5000
    })

    expect(setApprovalForAllSpy).toBeCalled()
  })

  it("should not transfer ownership if neverminedNodeAddress address is not set", async () => {
    const appConfigCopy = {...appConfig }
    appConfig.neverminedNodeAddress = ''
    const logSpy = jest.spyOn(Logger, 'log')

    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK, sdk } = Catalog.useNevermined()
        const [transfered, setTransfered] = useState<boolean>(false)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const [userAccount] = await sdk.accounts.list()
              const result = await assets.transfer({
                did: ddo.id,
                amount: 1,
                ercType: 1155,
                newOwner: userAccount
              })
              setTransfered(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return transfered
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(logSpy).toHaveBeenCalledWith("neverminedNodeAddress or neverminedNodeUri is not set. Abort.")
    })

    await waitFor(async () => {
      expect(result.current).toBe(false)
    })

    appConfig.neverminedNodeAddress = appConfigCopy.neverminedNodeAddress
  })

  it("should not transfer ownership if owner is not found", async () => {
    const sdk = await jest.requireActual('../mockups').nevermined.getInstance()
    jest.spyOn(nevermined, 'getInstance').mockResolvedValue({
      ...sdk,
      accounts: {
        ...sdk.accounts,
        list: async () => [],
      }
    })

    const logSpy = jest.spyOn(Logger, 'log')

    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK, sdk } = Catalog.useNevermined()
        const [transfered, setTransfered] = useState<boolean>(false)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const [userAccount] = await sdk.accounts.list()
              const result = await assets.transfer({
                did: ddo.id,
                amount: 1,
                ercType: 1155,
                newOwner: userAccount
              })
              setTransfered(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return transfered
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(logSpy).toHaveBeenCalledWith("Users need to be connected to perform a transfer. abort.")
    })

    await waitFor(async () => {
      expect(result.current).toBe(false)
    })
  })

  it("should not transfer ownership if agreementId is not found", async () => {
    const sdk = await jest.requireActual('../mockups').nevermined.getInstance()
    jest.spyOn(nevermined, 'getInstance').mockResolvedValue({
      ...sdk,
      accounts: {
        ...sdk.accounts,
        list: async () => [
          {
            getId: () => walletAddress
          }
        ],
      },
      nfts1155: {
        ...sdk.nfts1155,
        order: () => undefined
      }
    })

    const logSpy = jest.spyOn(Logger, 'log')

    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK, sdk } = Catalog.useNevermined()
        const [transfered, setTransfered] = useState<boolean>(false)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const [userAccount] = await sdk.accounts.list()
              const result = await assets.transfer({
                did: ddo.id,
                amount: 1,
                ercType: 1155,
                newOwner: userAccount
              })
              setTransfered(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return transfered
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(logSpy).toHaveBeenCalledWith("Could not approve spending from new owner wallet. abort.")
    }, {
      timeout: 5000
    })

    await waitFor(async () => {
      expect(result.current).toBe(false)
    })
  })

  it("should not transfer ownership if post transfer fail", async () => {
    const sdk = await jest.requireActual('../mockups').nevermined.getInstance()
    jest.spyOn(nevermined, 'getInstance').mockResolvedValue({
      ...sdk,
      nfts1155: {
        ...sdk.nfts1155,
        setApprovalForAll: async () => ({
          to: '0xf61B443A155b07D2b2cAeA2d99715dC84E83932f',
          from: walletAddress,
          contractAddress: nftTokenAddress,
          transactionIndex: 2,
          gasUsed: 23433044444,
          logsBloom: '',
          blockHash: '',
          transactionHash: '',
          logs: [],
          blockNumber: 133443,
          confirmations: 43,
          cumulativeGasUsed: 23433044444,
          effectiveGasPrice: 23433044444,
          byzantium: false,
          type: 2,
          events: [],
        }),
        order: () => agreementId
      },
      utils: {
        fetch: {
          post: () => undefined
        }
      }
    })

    const logSpy = jest.spyOn(Logger, 'log')

    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK,sdk } = Catalog.useNevermined()
        const [transfered, setTransfered] = useState<boolean>(false)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const [userAccount] = await sdk.accounts.list()
              const result = await assets.transfer({
                did: ddo.id,
                amount: 1,
                ercType: 1155,
                newOwner: userAccount
              })
              setTransfered(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return transfered
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(logSpy).toHaveBeenCalledWith("Something went wrong! Please try again.")
    }, {
      timeout: 5000
    })

    await waitFor(async () => {
      expect(result.current).toBe(false)
    })
  })

  it("Should get the details of an NFT asset", async () => {
    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const [ NFTDetails, setNFTDetails] = useState<NFTDetails>({} as NFTDetails)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const result = await assets.nftDetails(ddo.id, 1155)
              setNFTDetails(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return NFTDetails
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current.owner).toBe(ddo.id)
    })
  })
})
