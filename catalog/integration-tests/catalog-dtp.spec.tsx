import React, { useEffect, useState } from 'react'
import { Catalog, makeAccounts, Nevermined, Account, DDO, MetaData, AssetService, NFTAttributes, BigNumber, CryptoConfig, AuthToken, Nft1155Contract } from '../src'
import { faker } from '@faker-js/faker'
import { _grantAccess, _encryptFileMetadata, _getCryptoConfig } from '../src/utils/dtp'
import { appConfig } from "./config"
import { renderHook, waitFor } from '@testing-library/react'
import { getMetadata } from './metadata.mock'

const wrapperProvider = ({ children }: { children: React.ReactElement }) => (
  <Catalog.NeverminedProvider config={appConfig}>
    <AssetService.AssetPublishProvider>
      {children}
    </AssetService.AssetPublishProvider>
  </Catalog.NeverminedProvider>
)

describe('DTP', () => {
  let sdk: Nevermined
  let publisher: Account
  let ddoResult: DDO
  let consumer: Account
  let metadata: MetaData
  let cryptoConfig: CryptoConfig
  let token: Nft1155Contract

  const password = 'passwd_32_letters_1234567890asdF'

  beforeAll(async() => {
    if (process.env.SEED_WORDS) {
      appConfig.accounts = makeAccounts(process.env.SEED_WORDS)
    }

    sdk = await Nevermined.getInstance(appConfig);
    [publisher, consumer] = await sdk.accounts.list()

    cryptoConfig = await _getCryptoConfig(sdk, password)

    const clientAssertion = await sdk.utils.jwt.generateClientAssertion(publisher)

    const tokenPublisher = await sdk.services.marketplace.login(clientAssertion)
    
    AuthToken.saveMarketplaceApiTokenToLocalStorage({
      token: tokenPublisher,
    })

    metadata = await getMetadata(faker.name.fullName())
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should publish the dtp assets', async () => {
    token = sdk.nfts1155.nftContract

    const nftAttributes = NFTAttributes.getNFT1155Instance({
      metadata,
      serviceTypes: ['nft-sales-proof', 'nft-access'],
      providers: [appConfig.neverminedNodeAddress as string],
      cap: BigNumber.from(100),
      amount: BigNumber.from(1),
      preMint: true,
      nftContractAddress: token.address,
    })

    const { result } = renderHook(
      () => {
        const { isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const { publishNFT1155, isPublished } = AssetService.useAssetPublish()
        const [ddo, setDDO ] = useState<DDO>({} as DDO)

        useEffect(() => {
          if (isLoadingSDK) {
            updateSDK(appConfig)
            return
          }

          (async () => {
            const result = await publishNFT1155({
              publisher,
              nftAttributes,
              password,
              cryptoConfig,
            }) as DDO

            ddoResult = result
            setDDO(result)
          })()
        }, [isLoadingSDK])

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
      expect(result.current.isPublished).toBeTruthy()
    }, {
      timeout: 100000
    })
  })

  it('should access to the dtp asset', async() => {
    const clientAssertionConsumer = await sdk.utils.jwt.generateClientAssertion(consumer)

    const tokenConsumer = await sdk.services.marketplace.login(clientAssertionConsumer)

    AuthToken.saveMarketplaceApiTokenToLocalStorage({
      token: tokenConsumer,
    })

    const { result } = renderHook(
      () => {
        const { nfts, isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const [ agreementId, setAgreementId] = useState<string>()

        useEffect(() => {
          if (isLoadingSDK) {
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const result = await nfts.access({
                did: ddoResult.id,
                buyer: consumer,
                nftHolder: publisher.getId(),
                nftAmount: BigNumber.from(1),
                ercType: 1155,
                password,
              })

              setAgreementId(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return agreementId
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toBeTruthy()
    }, {
      timeout: 100000
    })
  })

  it('should download the dtp asset', async() => {
    global.URL.createObjectURL = jest.fn(() => 'nft')
    const { result } = renderHook(
      () => {
        const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const [isDownloaded, setIsDownloaded] = useState<string>('')

        useEffect(() => {
          if (isLoadingSDK) {
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const result = await assets.downloadNFT({did: ddoResult.id, consumer, ercType: 1155, path: undefined, fileIndex: 1, password}) as string
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
      expect(result.current).toBeTruthy()
    }, {
      timeout: 100000
    })
  })
})