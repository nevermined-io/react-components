import { Nevermined, MetaData, Account, BigNumber, NFTAttributes, DDO, makeAccounts, Dtp, 
  generateIntantiableConfigFromConfig, generateId, zeroX, Token } from '../src'
import { appConfig } from './config'
import { getMetadata } from './metadata.mock'
import { faker } from '@faker-js/faker'
import { _grantAccess, _encryptFileMetadata, _getCryptoConfig } from '../src/utils/dtp'

describe('DTP', () => {
  let sdk: Nevermined
  let publisher: Account
  let consumer: Account
  let ddo: DDO
  let dtp: Dtp
  let metadataEncrypted: MetaData
  let agreementId: string
  let token: Token

  const password = 'passwd_32_letters_1234567890asdF'

  beforeAll(async() => {
    if (process.env.SEED_WORDS) {
      appConfig.accounts = makeAccounts(process.env.SEED_WORDS)
    }

    sdk = await Nevermined.getInstance(appConfig);
    [publisher, consumer] = await sdk.accounts.list()

    const instanceConfig = {
      ...generateIntantiableConfigFromConfig(appConfig),
      nevermined: sdk,
    }

    const cryptoConfig = await _getCryptoConfig(sdk, password)

    dtp = await Dtp.getInstance(instanceConfig, cryptoConfig)

    const clientAssertion = await sdk.utils.jwt.generateClientAssertion(publisher)

    await sdk.services.marketplace.login(clientAssertion)
  })

  it('should encrypt metadata', async () => {
    const metadata = await getMetadata(faker.name.fullName())

    metadataEncrypted = await _encryptFileMetadata(sdk, dtp, metadata, password)

    console.log(metadataEncrypted.main)

    expect(metadataEncrypted.main.isDTP).toBe(true)
  })

  it('should publish asset', async () => {
    token = sdk.keeper.token
    await sdk.nfts1155.setApprovalForAll(appConfig.neverminedNodeAddress as string, true, publisher)

    const nftAttributes = NFTAttributes.getNFT1155Instance({
      metadata: metadataEncrypted,
      serviceTypes: ['nft-sales-proof', 'nft-access'],
      cap: BigNumber.from(100),
      amount: BigNumber.from(1),
      preMint: true,
      nftContractAddress: token.address,
    })
    
    ddo = await sdk.nfts1155.create(
      nftAttributes,
      publisher,
    )

    console.log(ddo.findServiceById(0).attributes)

    expect(ddo.findServiceById(0).attributes.encryptedFiles).toBeTruthy()
  })

  it('should order the file', async () => {
    const response = await _grantAccess({
      did: ddo.id,
      account: consumer,
      password,
      sdk,
      dtp
    }) as Account
    const lockPaymentCondition = sdk.keeper.conditions.lockPaymentCondition

    consumer = response

    console.log(response.getId())

    try {
      await consumer.requestTokens(BigNumber.from(12))
    } catch(error) {
      console.log(error)
    }

    await token.approve(lockPaymentCondition.getAddress(), BigNumber.from(12), consumer)
    agreementId = await dtp.order(ddo.id, BigNumber.from(1), consumer, publisher.getId())

    expect(response.babySecret).toBe(password)
    expect(agreementId).toBeTruthy()
  })

  it('should hash the value', async() => {
    const { transferNftCondition } = sdk.keeper.conditions

    const conditionId = generateId()
    const hash = await transferNftCondition.hashValues(
      ddo.id,
      publisher.getId(),
      consumer.getId(),
      BigNumber.from(1),
      zeroX(conditionId)
    )

    console.log(hash)

    expect(hash).toBeTruthy()
  })

  it('should transfer delegation to consumer', async() => {
    const result = await dtp.transferForDelegate(
      ddo.id,
      agreementId,
      consumer,
      BigNumber.from(1),
      publisher.getId(),
    )

    expect(result).toBeTruthy()
  })

  it('should download the file', async () => {
    global.URL.createObjectURL = jest.fn(() => 'nft')
    const response = await sdk.assets.download(ddo.id, consumer, undefined, 1, 'nft-sales-proof')

    console.log(response)

    expect(response).toBeTruthy()
  })
})