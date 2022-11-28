import { encryptMetadata, Nevermined, MetaData, Account, BigNumber, AssetRewards, DDO, makeAccounts, DTP, 
  generateIntantiableConfigFromConfig, generateId, zeroX, getGrantAccess } from '../src'
import { appConfig, walletAddress } from './config'
import { getMetadata } from './metadata.mock'
import { faker } from '@faker-js/faker'

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
    // appConfig.web3ProviderUri = 'http://localhost:8545'
    // appConfig.marketplaceUri = 'http://nevermined-metadata:3100'
    // appConfig.faucetUri = 'http://localhost:3001'
    // appConfig.neverminedNodeUri = 'http://localhost:8030'
    // appConfig.neverminedNodeAddress = '0x068ed00cf0441e4829d9784fcbe7b9e26d4bd8d0'
    // appConfig.web3Provider = undefined
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

    await sdk.marketplace.login(clientAssertion)
  })

  it('should encrypt metadata', async () => {
    const metadata = await getMetadata(faker.name.fullName())

    metadataEncrypted = await encryptMetadata(sdk, dtp, metadata, password)

    console.log(metadataEncrypted.main)

    expect(metadataEncrypted.main.isDTP).toBe(true)
  })

  it('should authenticate the accounts', async () => {
    await publisher.authenticate()
    await consumer.authenticate()
  })

  it('should publish asset', async () => {
    const assetRewardsMap = new Map([
      [walletAddress, BigNumber.from(0)]
    ])

    const assetRewards = new AssetRewards(assetRewardsMap)
    const networkFee = await sdk.keeper.nvmConfig.getNetworkFee()
    const feeReceiver = await sdk.keeper.nvmConfig.getFeeReceiver()
    
    assetRewards.addNetworkFees(feeReceiver, BigNumber.from(networkFee))
    ddo = await sdk.assets.createNft(
      metadataEncrypted,
      publisher,
      assetRewards,
      'PSK-RSA',
      BigNumber.from(100),
      undefined,
      BigNumber.from(1),
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      ['nft-access', 'nft-sales'],
    )

    console.log(ddo.findServiceById(0).attributes)

    expect(ddo.findServiceById(0).attributes.encryptedFiles).toBeTruthy()
  })

  it('should order the file', async () => {
    const response = await getGrantAccess({
      did: ddo.id,
      account: consumer,
      password,
      sdk,
      dtp
    }) as Account

    consumer = response

    console.log(response.getId())

    agreementId = await sdk.nfts.order(ddo.id, BigNumber.from(1), consumer)

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
    const file = await sdk.nfts.access(ddo.id, consumer, undefined, undefined, agreementId, false)

    console.log(file)

    expect(file).toBeTruthy()
  })
})