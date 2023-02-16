import { Nevermined, NFTAttributes, BigNumber, AuthToken } from '../src'
import { getMetadata } from '../integration-tests/metadata.mock'
import { appConfig } from './config'
import { faker } from '@faker-js/faker'

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const runWorkflow = async () => {
  try {
    global.URL.createObjectURL = jest.fn(() => 'nft')
    global.URL.revokeObjectURL = jest.fn(() => true)

    const sdk = await Nevermined.getInstance(appConfig)
    const [publisher, consumer] = await sdk.accounts.list()

    const clientAssertion = await sdk.utils.jwt.generateClientAssertion(publisher)

    const tokenPublisher = await sdk.services.marketplace.login(clientAssertion)

    AuthToken.saveMarketplaceApiTokenToLocalStorage({
      token: tokenPublisher,
    })

    const metadata = await getMetadata(faker.name.fullName())

    await sdk.nfts1155.setApprovalForAll(appConfig.neverminedNodeAddress as string, true, publisher)

    const nftAttributes = NFTAttributes.getNFT1155Instance({
      metadata,
      serviceTypes: ['nft-sales', 'nft-access'],
      cap: BigNumber.from(100),
      amount: BigNumber.from(1),
      preMint: true,
      nftContractAddress: sdk.nfts1155.nftContract.address,
    })

    const ddo = await sdk.nfts1155.create(nftAttributes, publisher)

    await sleep(2000)

    const token = sdk.keeper.token

    const lockPaymentCondition = sdk.keeper.conditions.lockPaymentCondition

    try {
      await consumer.requestTokens(BigNumber.from(12))
    } catch (error) {
      console.log(error)
    }

    await token.approve(lockPaymentCondition.getAddress(), BigNumber.from(12), consumer)
    const agreementId = await sdk.nfts1155.order(ddo.id, BigNumber.from(1), consumer)

    console.log(agreementId)

    await sdk.nfts1155.transferForDelegate(
      agreementId,
      publisher.getId(),
      consumer.getId(),
      BigNumber.from(1),
      1155,
    )

    await sleep(2000)

    await sdk.nfts1155.access(ddo.id, consumer)

    return {
      ddo: ddo,
      publisherAddress: publisher.getId(),
      consumerAddress: consumer.getId(),
      agreementId,
    }
  } catch (error: any) {
    throw new Error(error)
  }
}
