import React, { useEffect, useState } from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { generateTestingUtils } from 'eth-testing'
import { appConfig } from '../config'
import { Catalog, AssetService, DDO, RoyaltyKind, getRoyaltyScheme, MarketplaceAPIToken, Logger, Nevermined, BigNumber } from '../../src'
import { ddo as assetObject, metadata, nftTokenAddress, walletAddress } from '../mockups'
import { faker } from '@faker-js/faker'
import jwt from 'jsonwebtoken'

jest.mock('@nevermined-io/nevermined-sdk-js', () => ({
  ...jest.requireActual('@nevermined-io/nevermined-sdk-js'),
  Nevermined: jest.requireActual('../mockups').nevermined
}))

const wrapperProvider = ({ children }: { children: React.ReactElement }) => (
  <Catalog.NeverminedProvider config={appConfig}>
    <AssetService.AssetPublishProvider>
      {children}
    </AssetService.AssetPublishProvider>
  </Catalog.NeverminedProvider>
)

describe('Assets Service', () => {
  const testingUtils = generateTestingUtils({ providerType: 'MetaMask' })
  const royaltyAttributes = (sdk: Nevermined) => ({
    royaltyKind: RoyaltyKind.Standard,
    scheme: getRoyaltyScheme(sdk, RoyaltyKind.Standard),
    amount: 0,
  })

  afterEach(() => {
    testingUtils.clearAllMocks()
    jest.clearAllMocks()
  })

  it('should find assets', async () => {
    const { result } = renderHook(
      () => {
        const { isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const { result } = AssetService.useAssets({
          query: {
            id: assetObject.id
          }
        })

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }
        }, [isLoadingSDK, result])

        return result
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current.results).toStrictEqual([assetObject])
    })
  })

  it('should find an asset', async () => {
    const { result } = renderHook(
      () => {
        const { isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const { ddo, metadata } = AssetService.useAsset(assetObject.id)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }
        }, [isLoadingSDK, ddo])

        return {
          ddo,
          metadata,
        }
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toStrictEqual({
        ddo: assetObject,
        metadata: assetObject.service[0].attributes,
      })
    })
  })

  it('should publish an asset', async() => {
    const { result } = renderHook(
      () => {
        const { isLoadingSDK, updateSDK, account } = Catalog.useNevermined()
        const { publishAsset, isPublished } = AssetService.useAssetPublish()
        const [ddo, setDDO ] = useState<DDO>({} as DDO)

        jest.spyOn(account, 'isTokenValid').mockReturnValue(true)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            const result = await publishAsset({
              metadata,
            }) as DDO

            setDDO(result)
          })()
        }, [isLoadingSDK, ddo])

        return {
          ddo,
          isPublished,
        }
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toStrictEqual({
        ddo: assetObject,
        isPublished: true,
      })
    })
  })

  it('should publish an nft721', async() => {
    const { result } = renderHook(
      () => {
        const { isLoadingSDK, updateSDK, sdk } = Catalog.useNevermined()
        const { publishNFT721, isPublished } = AssetService.useAssetPublish()
        const [ddo, setDDO ] = useState<DDO>({} as DDO)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            const result = await publishNFT721({
              nftAddress: nftTokenAddress,
              metadata,
              providers: undefined,
              royaltyAttributes: royaltyAttributes(sdk)
            }) as DDO

            setDDO(result)
          })()
        }, [isLoadingSDK, ddo])

        return {
          ddo,
          isPublished,
        }
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toStrictEqual({
        ddo: assetObject,
        isPublished: true,
      })
    })
  })

  it('should publish an nft1155', async() => {
    const { result } = renderHook(
      () => {
        const { isLoadingSDK, updateSDK, sdk } = Catalog.useNevermined()
        const { publishNFT1155, isPublished } = AssetService.useAssetPublish()
        const [ddo, setDDO ] = useState<DDO>({} as DDO)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            const result = await publishNFT1155({
              neverminedNodeAddress: String(appConfig.neverminedNodeAddress),
              metadata,
              cap: BigNumber.from(100),
              royaltyAttributes: royaltyAttributes(sdk)
            }) as DDO

            setDDO(result)
          })()
        }, [isLoadingSDK, ddo])

        return {
          ddo,
          isPublished,
        }
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toStrictEqual({
        ddo: assetObject,
        isPublished: true,
      })
    })
  })

  it('should not mint if node address is not set', async () => {
    const logSpy = jest.spyOn(Logger, 'error')
    const appConfigCopy = {...appConfig }
    appConfig.neverminedNodeAddress = ''

    renderHook(
      () => {
        const { isLoadingSDK, updateSDK, sdk } = Catalog.useNevermined()
        const { publishNFT1155 } = AssetService.useAssetPublish()

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              await publishNFT1155({
                neverminedNodeAddress: '',
                metadata,
                cap: BigNumber.from(100),
                royaltyAttributes: royaltyAttributes(sdk),
            })
              
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(logSpy).toBeCalledWith('neverminedNodeAddress from config is required to mint NFT1155 asset')
    })

    appConfig.neverminedNodeAddress = appConfigCopy.neverminedNodeAddress
  })

  it('should update asset to publish after call handleChange function', async() => {
    const author = faker.name.firstName()

    const { result } = renderHook(
      () => {
        const { isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const { assetPublish, setAssetPublish, handleChange } = AssetService.useAssetPublish()

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            if(!assetPublish.author) {
              setAssetPublish({
                name: '',
                author: '',
                description: '',
                type: 'dataset',
                category: 'None',
                price: 0,
                assetFiles: []
              })
  
              handleChange(author, 'author')
            }
          })()
        }, [isLoadingSDK, assetPublish])

        return assetPublish
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current.author).toBe(author)
    })
  })

  it('should reset asset to publish', async() => {
    const { result } = renderHook(
      () => {
        const { isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const { assetPublish, setAssetPublish, reset } = AssetService.useAssetPublish()
        const [count, setCount] = useState(0)

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            if(!count) {
              setAssetPublish({
                name: faker.name.jobTitle(),
                author: faker.name.firstName(),
                description: faker.lorem.sentence(),
                type: 'dataset',
                category: 'None',
                price: 0,
                assetFiles: []
              })
  
              reset({
                name: '',
                author: '',
                description: '',
                type: 'dataset',
                category: 'None',
                price: 0,
                assetFiles: []
              })

              setCount(count + 1)
            }
          })()
        }, [isLoadingSDK, assetPublish])

        return assetPublish
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toStrictEqual({
        name: '',
        author: '',
        description: '',
        type: 'dataset',
        category: 'None',
        price: 0,
        assetFiles: []
      })
    })
  })

  it('should throw an error if token is not valid', async () => {
    let generateTokenSpy: jest.SpyInstance<Promise<MarketplaceAPIToken>, any>

    renderHook(
      () => {
        const { isLoadingSDK, updateSDK, account } = Catalog.useNevermined()
        const { publishAsset, errorAssetMessage } = AssetService.useAssetPublish()

        jest.spyOn(account, 'isTokenValid').mockReturnValue(false)

        generateTokenSpy = jest.spyOn(account, 'generateToken')

        generateTokenSpy.mockImplementation(async() => {
          const token = jwt.sign({iss: walletAddress,
            sub: `u-${faker.datatype.uuid()}`,
            role: [],
            exp: faker.date.future().getTime()
          }, 'secret')
          
          return {
            token,
          }
        })

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            await publishAsset({
              metadata,
            }) as DDO
          })()
        }, [isLoadingSDK, errorAssetMessage])

        return errorAssetMessage
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(generateTokenSpy).toBeCalledTimes(1)
    })
  })
})