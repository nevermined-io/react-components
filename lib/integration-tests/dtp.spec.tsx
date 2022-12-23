import { Nevermined, MetaData, Account, BigNumber, AssetPrice, NFTAttributes, DDO, makeAccounts, DTP, 
  generateIntantiableConfigFromConfig, generateId, zeroX, getRoyaltyAttributes, RoyaltyKind } from '../src'
import { appConfig, walletAddress } from './config'
import { getMetadata } from './metadata.mock'
import { faker } from '@faker-js/faker'
import { _getGrantAccess, _encryptFileMetadata } from '../src/utils/dtp'

describe('DTP', () => {
  let sdk: Nevermined
  let publisher: Account
  let consumer: Account
  let ddo: DDO
  let dtp: DTP.Dtp
  let metadataEncrypted: MetaData
  let agreementId: string

  const password = 'passwd_32_letters_1234567890asdF'

  beforeAll(async() => {
    appConfig.web3ProviderUri = 'http://localhost:8545'
    appConfig.marketplaceUri = 'http://nevermined-metadata:3100'
    appConfig.neverminedNodeUri = 'http://localhost:8030'
    appConfig.neverminedNodeAddress = '0x068ed00cf0441e4829d9784fcbe7b9e26d4bd8d0'
    appConfig.web3Provider = undefined
    if (process.env.SEED_WORDS) {
      appConfig.accounts = makeAccounts(process.env.SEED_WORDS)
    }

    sdk = await Nevermined.getInstance(appConfig);
    [publisher, consumer] = await sdk.accounts.list()

    const instanceConfig = {
      ...generateIntantiableConfigFromConfig(appConfig),
      nevermined: sdk,
    }

    dtp = await DTP.Dtp.getInstance(instanceConfig, null as any)

    const clientAssertion = await sdk.utils.jwt.generateClientAssertion(publisher)

    await sdk.services.marketplace.login(clientAssertion)
  })

  it('should authenticate the accounts', async () => {
    await publisher.authenticate()
    await consumer.authenticate()
  })

  it('should encrypt metadata', async () => {
    const metadata = await getMetadata(faker.name.fullName())

    metadataEncrypted = await _encryptFileMetadata(sdk, dtp, metadata, password)

    console.log(metadataEncrypted.main)

    expect(metadataEncrypted.main.isDTP).toBe(true)
  })

  it('should publish asset', async () => {
    const assetRewardsMap = new Map([
      [walletAddress, BigNumber.from(0)]
    ])

    const assetPrice = new AssetPrice(assetRewardsMap)

    const royaltyAttributes = getRoyaltyAttributes(
      sdk,
      RoyaltyKind.Standard,
      0,
    )

    const nftAttributes = NFTAttributes.getNFT1155Instance({
      metadata: metadataEncrypted,
      encryptionMethod: 'PSK-RSA',
      price: assetPrice,
      serviceTypes: ['nft-access', 'nft-sales'],
      cap: BigNumber.from(100),
      amount: BigNumber.from(1),
      preMint: true,
      nftContractAddress: sdk.keeper.nftUpgradeable.address,
      royaltyAttributes,
    })
    
    ddo = await sdk.nfts1155.create(
      nftAttributes,
      publisher,
    )

    console.log(ddo.findServiceById(0).attributes)

    expect(ddo.findServiceById(0).attributes.encryptedFiles).toBeTruthy()
  })

  it('should order the file', async () => {
    const response = await _getGrantAccess({
      did: ddo.id,
      account: consumer,
      password,
      sdk,
      dtp
    }) as Account

    consumer = response

    console.log(response.getId())

    agreementId = await sdk.nfts1155.order(ddo.id, BigNumber.from(1), consumer)

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

  it('should download the file', async () => {
    const file = await sdk.nfts1155.access(ddo.id, consumer, undefined, undefined, agreementId, false)

    console.log(file)

    expect(file).toBeTruthy()
  })
})