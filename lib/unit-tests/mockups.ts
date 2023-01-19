import { faker } from '@faker-js/faker'
import { MetaData, Profile, State } from '../src'
import jwt from 'jsonwebtoken'

export const ddo = {
  '@context': 'https://w3id.org/did/v1',
  findServiceByType: () => ddo.service[0],
  authentication: [
    {
      type: 'RsaSignatureAuthentication2018',
      publicKey: 'did:nv:0c184915b07b44c888d468be85a9b28253e80070e5294b1aaed81c2f0264e430',
    },
  ],
  created: '2019-05-22T08:44:27Z',
  updated: '2019-03-08T08:13:49Z',
  id: 'did:nv:0c184915b07b44c888d468be85a9b28253e80070e5294b1aaed81c2f0264e430',
  proof: {
    type: 'DDOIntegritySignature',
    created: '2019-05-22T08:44:27Z',
    creator: '0x00Bd138aBD70e2F00903268F3Db08f2D25677C9e',
    signatureValue:
      '0xbd7b46b3ac664167bc70ac211b1a1da0baed9ead91613a5f02dfc25c1bb6e3ff40861b455017e8a587fd4e37b703436072598c3a81ec88be28bfe33b61554a471b',
    checksum: {
      '0': '0x52b5c93b82dd9e7ecc3d9fdf4755f7f69a54484941897dc517b4adfe3bbc3377',
      '1': '0x999999952b5c93b82dd9e7ecc3d9fdf4755f7f69a54484941897dc517b4adfe4',
    },
  },
  publicKey: [
    {
      id: 'did:nv:0c184915b07b44c888d468be85a9b28253e80070e5294b1aaed81c2f0264e430',
      type: 'EthereumECDSAKey',
      owner: '0x00Bd138aBD70e2F00903268F3Db08f2D25677C9e',
    },
  ],
  verifiableCredential: [
    {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://www.w3.org/2018/credentials/examples/v1',
      ],
      id: '1872',
      type: ['read', 'update', 'deactivate'],
      issuer: '0x610D9314EDF2ced7681BA1633C33fdb8cF365a12',
      issuanceDate: '2019-01-01T19:73:24Z',
      credentialSubject: {
        id: '0x89328493849328493284932',
      },
      proof: {
        type: 'RsaSignature2018',
        created: '2019-01-01T19:73:24Z',
        proofPurpose: 'assertionMethod',
        signatureValue: 'ABCJSDAO23...1tzjn4w==',
      },
    },
  ],
  service: [
    {
      index: 0,
      serviceEndpoint: 'http://localhost:5000/api/v1/metadata/assets/ddo/{did}',
      type: 'metadata',
      attributes: {
        encryptedFiles:
          '0x2e48ceefcca7abb024f90c87c676fce8f7913f889605a349c08c0c4a822c69ad651e122cc81db4fbb52938ac627786491514f37a2ebfd04fd98ec726f1d9061ed52f13fde132222af34d9af8ec358429cf45fc669f81a607185cb9a8150df3cbb2b4e3e382fb16429be228ddd920f061b78dd54701025fac8aab976239fb31a5b60a57393e96a338324c5ac8a5600a1247339c4835533cecdb5b53caf6b6f9d6478b579b7426f650a4154a20d18a9d49f509770af62647a57fc174741b47af3c8beeaaa76bee276cce8fba1f3fec0e1c',
        main: {
          author: 'Met',
          dateCreated: '2019-02-08T08:13:49Z',
          files: [
            {
              index: 0,
              checksum: 'efb2c764274b745f5fc37f97c6b0e761',
              contentLength: '4535431',
              contentType: 'text/csv',
              encoding: 'UTF-8',
              compression: 'zip',
            },
          ],
          license: 'CC-BY',
          name: 'UK Weather information 2011',
          price: '1',
          type: 'dataset',
        },
        additionalInformation: {
          description: 'Weather information of UK including temperature and humidity',
          tags: ['weather', 'uk', '2011', 'temperature', 'humidity'],
          workExample: '423432fsd,51.509865,-0.118092,2011-01-01T10:55:11+00:00,7.2,68',
          copyrightHolder: 'Met',
          links: [
            {
              name: 'Sample of Asset Data',
              type: 'sample',
            },
            {
              name: 'Data Format Definition',
              type: 'format',
            },
          ],
          inLanguage: 'en',
          updateFrequency: 'yearly',
          structuredMarkup: [
            {
              uri: 'http://skos.um.es/unescothes/C01194/jsonld',
              mediaType: 'application/ld+json',
            },
            {
              uri: 'http://skos.um.es/unescothes/C01194/turtle',
              mediaType: 'text/turtle',
            },
          ],
        },
        curation: {
          numVotes: 123,
          rating: 0,
          schema: 'Binary Votting',
          isListed: true,
        },
      },
    },
    {
      type: 'access',
      index: 1,
      serviceEndpoint: 'http://localhost:8030/api/v1/node/services/consume',
      templateId: '0x1234',
      attributes: {
        main: {
          name: 'dataAssetAccessServiceAgreement',
          creator: '',
          datePublished: '2019-02-08T08:13:49Z',
          price: '10',
          timeout: 36000,
        },
        additionalInformation: {
          description: '',
        },
        serviceAgreementTemplate: {
          contractName: 'EscrowAccessSecretStoreTemplate',
          events: [
            {
              name: 'AgreementCreated',
              actorType: 'consumer',
              handler: {
                moduleName: 'escrowAccessSecretStoreTemplate',
                functionName: 'fulfillLockPaymentCondition',
                version: '0.1',
              },
            },
          ],
          fulfillmentOrder: ['lockPayment.fulfill', 'access.fulfill', 'escrowPayment.fulfill'],
          conditionDependency: {
            lockPayment: [],
            grantSecretStoreAccess: [],
            releaseReward: ['lockPayment', 'access'],
          },
          conditions: [
            {
              name: 'lockPayment',
              timelock: 0,
              timeout: 0,
              contractName: 'LockPaymentCondition',
              functionName: 'fulfill',
              parameters: [
                {
                  name: '_did',
                  type: 'bytes32',
                  value: '',
                },
                {
                  name: '_rewardAddress',
                  type: 'address',
                  value: '',
                },
                {
                  name: '_tokenAddress',
                  type: 'address',
                  value: '',
                },
                {
                  name: '_amounts',
                  type: 'uint256[]',
                  value: ['10', '2'],
                },
                {
                  name: '_receivers',
                  type: 'address[]',
                  value: [
                    '0x00Bd138aBD70e2F00903268F3Db08f2D25677C9e',
                    '0x068ed00cf0441e4829d9784fcbe7b9e26d4bd8d0',
                  ],
                },
              ],
              events: [
                {
                  name: 'Fulfilled',
                  actorType: 'publisher',
                  handler: {
                    moduleName: 'lockPaymentConditon',
                    functionName: 'fulfillAccessCondition',
                    version: '0.1',
                  },
                },
              ],
            },
            {
              name: 'access',
              timelock: 0,
              timeout: 0,
              contractName: 'AccessCondition',
              functionName: 'fulfill',
              parameters: [
                {
                  name: '_did',
                  type: 'bytes32',
                  value: '',
                },
                {
                  name: '_grantee',
                  type: 'address',
                  value: '',
                },
              ],
              events: [
                {
                  name: 'Fulfilled',
                  actorType: 'publisher',
                  handler: {
                    moduleName: 'access',
                    functionName: 'fulfillEscrowPaymentCondition',
                    version: '0.1',
                  },
                },
                {
                  name: 'TimedOut',
                  actorType: 'consumer',
                  handler: {
                    moduleName: 'access',
                    functionName: 'fulfillEscrowPaymentCondition',
                    version: '0.1',
                  },
                },
              ],
            },
            {
              name: 'escrowPayment',
              timelock: 0,
              timeout: 0,
              contractName: 'EscrowPaymentCondition',
              functionName: 'fulfill',
              parameters: [
                {
                  name: '_did',
                  type: 'bytes32',
                  value: '',
                },
                {
                  name: '_amounts',
                  type: 'uint256[]',
                  value: ['10', '2'],
                },
                {
                  name: '_receivers',
                  type: 'address[]',
                  value: [
                    '0x00Bd138aBD70e2F00903268F3Db08f2D25677C9e',
                    '0x068ed00cf0441e4829d9784fcbe7b9e26d4bd8d0',
                  ],
                },
                {
                  name: '_sender',
                  type: 'address',
                  value: '',
                },
                {
                  name: '_tokenAddress',
                  type: 'address',
                  value: '',
                },
                {
                  name: '_lockCondition',
                  type: 'bytes32',
                  value: '',
                },
                {
                  name: '_releaseCondition',
                  type: 'bytes32',
                  value: '',
                },
              ],
              events: [
                {
                  name: 'Fulfilled',
                  actorType: 'publisher',
                  handler: {
                    moduleName: 'escrowPaymentConditon',
                    functionName: 'verifyRewardTokens',
                    version: '0.1',
                  },
                },
              ],
            },
          ],
        },
      },
    },
    {
      index: 2,
      type: 'authorization',
      attributes: {
        main: {
          service: 'PSK-ECDSA',
          publicKey:
            '0xd793eb43ef7d191bf64f127c9f1a2c9037406d72706d3be7dc564fb9a9f08f21156b32d1ee3afbe64cc9f676f6facffac1377f7804daf932d3b8aa04fdeb0630',
        },
      },
      serviceEndpoint: 'http://localhost:8030/',
    },
  ],
}

export const walletAddress = '0xf61B443A155b07D2b2cAeA2d99715dC84E839EEf'
export const walletAddress2 = '0xf61B443A155b07D2b2cAeA2d99715dC84E83932f'
export const agreementId = '0xdB1B443A155b07D2b2cAeA2d99715dC84E839EE4'
export const nftTokenAddress = '0xdB3B4435155b07D2b2cAeA2d99715dC84E839Af8'

export const newProfile: Partial<Profile> = {
  userId: `u-${faker.datatype.uuid()}`,
  name: faker.name.firstName(),
  nickname: faker.internet.userName(),
  email: faker.internet.email(),
  state: 'confirmed' as State,
  updateDate: new Date(),
  addresses: [walletAddress],
  additionalInformation: {
    linkedinProfile: '',
  },
}

export const updatedProfile: Partial<Profile> = {
  ...newProfile,
  nickname: faker.internet.userName(),
}

export const profileResult = {
  userId: newProfile.userId,
  name: newProfile.name,
  nickname: newProfile.nickname,
  email: newProfile.email,
  updateDate: newProfile.updateDate?.toDateString(),
  state: newProfile.state,
  additionalInformation: {
    linkedinProfile: '',
  },
}

export const nevermined = {
  getInstance: async () => ({
    assets: {
      resolve: async () => ddo,
      owner: async () => '0xdF1B443A155b07D2b2cAeA2d99715dC84E812EE2',
      order: async () => agreementId,
      download: async () => true,
      create: async () => ddo,
      createNft721: async () => ddo,
      access: async () => true,
    },
    accounts: {
      list: async () => [
        {
          getId: () => walletAddress,
        },
      ],
    },
    services: {
      metadata: {
        queryMetadata: async () => ({
          totalPages: 1,
          totalResults: 1,
          page: 1,
          results: [ddo],
        }),
      },
      marketplace: {
        login: () =>
          jwt.sign(
            {
              iss: walletAddress,
              sub: `u-${faker.datatype.uuid()}`,
              role: [],
              exp: faker.date.future().getTime(),
            },
            'secret',
          ),
        addNewAddress: () =>
          jwt.sign(
            {
              iss: walletAddress,
              sub: `u-${faker.datatype.uuid()}`,
              role: [],
              exp: faker.date.future().getTime(),
            },
            'secret',
          ),
      },
      profiles: {
        update: () => updatedProfile,
        findOneByAddress: () => newProfile,
      },
    },
    nfts1155: {
      ownerOf: async () => walletAddress,
      balance: async () => 1500000000000000,
      order: async () => agreementId,
      access: async () => true,
      details: async () => ({
        owner: ddo.id,
        lastChecksum: faker.date.past().toDateString(),
        url: 'https://nevermined.io',
        lastUpdatedBy: faker.date.past().toDateString(),
        blockNumberUpdated: 13445,
        providers: [],
        nftSupply: 100,
        mintCap: 100,
        royalties: 0,
      }),
      setApprovalForAll: async () => ({
        to: walletAddress2,
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
      create: async () => ddo,
      createWithRoyalties: async () => ddo,
      transferForDelegate: async () => true,
    },
    nfts721: {
      ownerOf: async () => walletAddress,
      balance: async () => 1500000000000000,
      order: async () => agreementId,
      access: async () => true,
      details: async () => ({
        owner: ddo.id,
        lastChecksum: faker.date.past().toDateString(),
        url: 'https://nevermined.io',
        lastUpdatedBy: faker.date.past().toDateString(),
        blockNumberUpdated: 13445,
        providers: [],
        nftSupply: 100,
        mintCap: 100,
        royalties: 0,
      }),
      setApprovalForAll: async () => ({
        to: walletAddress2,
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
      create: async () => ddo,
      createWithRoyalties: async () => ddo,
      transferForDelegate: async () => true,
    },
    keeper: {
      conditions: {
        transferNftCondition: {
          address: '0x610D9314EDF2ced7681BA1633C33fdb8cF365a12',
        },
        accessCondition: {
          events: {
            getPastEvents: () => [
              {
                _documentId: faker.datatype.uuid(),
              },
            ],
          },
        },
      },
      templates: {
        accessTemplate: {
          events: {
            getPastEvents: () => [
              {
                _creator: walletAddress,
                _did: ddo.id,
                _agreementId: agreementId,
              },
            ],
          },
        },
        nft721AccessTemplate: {
          events: {
            getPastEvents: () => [
              {
                _creator: walletAddress,
                _did: ddo.id,
                _agreementId: agreementId,
              },
            ],
          },
        },
        nftAccessTemplate: {
          events: {
            getPastEvents: () => [
              {
                _creator: walletAddress,
                _did: ddo.id,
                _agreementId: agreementId,
              },
            ],
          },
        },
      },
      nftUpgradeable: {
        isApprovedForAll: () => true,
      },
      royalties: {
        standard: 'standard',
        curve: 'curve',
        legacy: 'legacy',
      },
    },
    contracts: {
      loadErc20: async () => ({
        name: async () => 'Nevermined',
        symbol: async () => 'NVM',
        decimals: async () => 18,
        balanceOf: async () => 1500000000000000000,
      }),
      loadNft721: async () => ({
        balanceOf: async () => ({
          gt: () => true,
        }),
      }),
    },

    utils: {
      fetch: {
        post: () => ({
          ok: true,
        }),
      },
      jwt: {
        generateClientAssertion: () => faker.internet.password(20),
      },
    },
  }),
}

export const metadata: MetaData = {
  main: {
    name: '',
    files: [
      {
        index: 0,
        contentType: 'application/json',
        url: 'https://github.com/nevermined-io/docs/blob/master/docs/architecture/specs/metadata/examples/ddo-example.json',
      },
    ],
    type: 'dataset',
    author: '',
    license: '',
    dateCreated: new Date().toISOString(),
  },
}

export const mintNFTInput = {
  metadata,
  publisher: walletAddress,
  cap: 100,
  royalties: 0,
  nftAmount: 1,
  preMint: true,
  erc20TokenAddress: '0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e',
  assetRewards: {},
}
