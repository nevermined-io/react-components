import React, { useEffect, useState } from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { generateTestingUtils } from 'eth-testing'
import { appConfig } from '../config'
import { agreementId, ddo, nevermined } from '../mockups'
import { Catalog, BigNumber } from '../../src'


jest.mock('@nevermined-io/sdk', () => ({
  ...jest.requireActual('@nevermined-io/sdk'),
  Nevermined: jest.requireActual('../mockups').nevermined
}))

const wrapperProvider = ({ children }: { children: React.ReactElement }) => (
  <Catalog.NeverminedProvider config={appConfig}>{children}</Catalog.NeverminedProvider>
)

describe('Nevermined subscription', () => {
  const testingUtils = generateTestingUtils({ providerType: 'MetaMask' })

  afterEach(() => {
    testingUtils.clearAllMocks()
    jest.clearAllMocks()
  })

  it('should buy subscription NFT721', async () => {
    const sdk = await jest.requireActual('../mockups').nevermined.getInstance()
    const sdkSpy = jest.spyOn(nevermined, 'getInstance')

    sdkSpy.mockResolvedValue({
      ...sdk,
    })

    const sdkInstance: any = await sdkSpy.getMockImplementation()?.()

    const orderNFT721Spy = jest.spyOn(sdkInstance.nfts721, 'order')

    const orderNFT1155Spy = jest.spyOn(sdkInstance.nfts1155, 'order')

    const { result } = renderHook(
      () => {
        const { nfts, isLoadingSDK, updateSDK, sdk } = Catalog.useNevermined()
        const [ agreementIdResult, setAgreementId] = useState<string>('')

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const [account] = await sdk.accounts.list()
              const result = await nfts.access({
                did: ddo.id,
                buyer: account,
                nftHolder: '0x00Bd138aBD70e2F00903268F3Db08f2D25677C9e',
                nftAmount: BigNumber.from(1),
                ercType: 721,
              })

              setAgreementId(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return agreementIdResult
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(orderNFT721Spy).toBeCalledTimes(1)
    })

    await waitFor(async () => {
      expect(orderNFT1155Spy).not.toBeCalled()
    })

    await waitFor(async () => {
      expect(result.current).toStrictEqual(agreementId)
    })
  })

  it('should buy NFT1155', async () => {
    const sdk = await jest.requireActual('../mockups').nevermined.getInstance()
    const sdkSpy = jest.spyOn(nevermined, 'getInstance')

    sdkSpy.mockResolvedValue({
      ...sdk,
    })

    const sdkInstance: any = await sdkSpy.getMockImplementation()?.()

    const orderNFT721Spy = jest.spyOn(sdkInstance.nfts721, 'order')

    const orderNFT1155Spy = jest.spyOn(sdkInstance.nfts1155, 'order')

    const { result } = renderHook(
      () => {
        const { nfts, isLoadingSDK, updateSDK } = Catalog.useNevermined()
        const [ agreementIdResult, setAgreementId] = useState<string>('')

        useEffect(() => {
          if (isLoadingSDK) {
            appConfig.web3Provider = testingUtils.getProvider()
            updateSDK(appConfig)
            return
          }

          (async () => {
            try {
              const [account] = await sdk.accounts.list()
              const result = await nfts.access({
                did: ddo.id,
                buyer: account,
                nftHolder: '0x00Bd138aBD70e2F00903268F3Db08f2D25677C9e',
                nftAmount: BigNumber.from(1),
                ercType: 1155,
              })

              setAgreementId(result)
            } catch (error: any) {
              console.error(error.message)
            }
          })()
        }, [isLoadingSDK])

        return agreementIdResult
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(orderNFT721Spy).not.toBeCalled()
    })

    await waitFor(async () => {
      expect(orderNFT1155Spy).toBeCalledTimes(1)
    })

    await waitFor(async () => {
      expect(result.current).toStrictEqual(agreementId)
    })
  })
})