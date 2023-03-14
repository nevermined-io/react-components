import { Account, DDO, Nevermined, Logger, ClientError } from '..'
import { BigNumber, ERCType, SubscribablePromise } from '../types'
import axios from 'axios'
import axiosRetry from 'axios-retry'

/**
 * Checks if object is empty
 * @param i Object to check
 * @return `true` if object is empty or undefined
 */
export const isEmptyObject = (i: any) => !i || Object.keys(i).length < 1

/**
 * Returns current account registered in SDK
 * @param sdk Instance of SDK object
 */
export const getCurrentAccount = async (sdk: Nevermined, index = 0) => {
  let accounts: Account[] = []
  if (sdk.accounts) {
    accounts = await sdk.accounts.list()
  }

  return accounts[index]
}

type Template = 'accessTemplate' | 'nft721AccessTemplate' | 'nftAccessTemplate' | 'nftSalesTemplate'

type Condition = 'accessCondition' | 'nftAccessCondition'

/**
 * Order transfer asset to a new owner
 * @param orderParams
 * @param orderParams.sdk Instance of SDK object
 * @param orderParams.ddo Asset object
 * @param orderParams.neverminedNodeAddress Address of Node to allow handle the asset transaction
 * @param orderParams.newOwner Address of the new owner who will be transferred the asset
 * @param orderParams.ercType NFT Type
 * @return Agreement id generated after order an asset
 */
export const conductOrder = async ({
  sdk,
  ddo,
  neverminedNodeAddress,
  newOwner,
  ercType,
}: {
  sdk: Nevermined
  neverminedNodeAddress: string
  ddo: DDO
  newOwner: Account
  ercType?: ERCType
}): Promise<string> => {
  try {
    Logger.log('Checking if USDC spending is approved.')
    const isApproved = await sdk.keeper.nftUpgradeable.isApprovedForAll(
      newOwner.getId(),
      neverminedNodeAddress,
    )
    if (!isApproved) {
      const receipt =
        ercType === 721
          ? await sdk.nfts721.setApprovalForAll(neverminedNodeAddress, true, newOwner)
          : await sdk.nfts1155.setApprovalForAll(neverminedNodeAddress, true, newOwner)
      Logger.log('Approval receipt:', receipt)
    }
    Logger.log('USDC spending is approved.')
    Logger.log(`Asking for approval and locking payment for USDC.`)
    const agreementId: string =
      ercType === 721
        ? await sdk.nfts721.order(ddo.id, newOwner)
        : await sdk.nfts1155.order(ddo.id, BigNumber.from(1), newOwner)
    Logger.log('Transferring the NFT.')
    Logger.log('Order agreement ID', agreementId)
    return agreementId
  } catch (error) {
    console.error(error)
    return ''
  }
}

/**
 * Load all the past events from an account that match with the method `getFulfilleds`
 * @param sdk Instance of SDK object
 * @param account Account user connected currently
 * @returns Array of object with the document id of each fullfilled events
 */
export const loadFulfilledEvents = async (
  sdk: Nevermined,
  account: string,
  condition: Condition,
): Promise<{ documentId: string }[]> => {
  const fulfilled = await sdk.keeper.conditions[condition].events.getPastEvents({
    methodName: 'getFulfilleds',
    eventName: 'Fulfilled',
    filterSubgraph: {
      where: {
        _grantee: account,
      },
    },
    filterJsonRpc: { _grantee: account },
    result: {
      _documentId: true,
    },
  })

  return fulfilled.map((doc) => ({ documentId: doc._documentId }))
}

/**
 * Get agreement id of the asset based in the account that request it
 * @param sdk Instance of SDK object
 * @param template The template to use according of type of asset
 * @param did The id of the asset
 * @returns Agreement id generated after order an asset
 */
export const getAgreementId = async (
  sdk: Nevermined,
  template: Template,
  did: string,
): Promise<string> => {
  const agreements = await sdk.keeper.templates[template].events.getPastEvents({
    methodName: 'getAgreementCreateds',
    eventName: 'AgreementCreated',
    filterSubgraph: {
      where: {
        _did: did,
      },
    },
    filterJsonRpc: {},
    result: {
      _agreementId: true,
    },
  })

  return agreements[0]?._agreementId
}

/**
 * Handle a post request with retries if it fail
 * @param url Url to request
 * @param formData The form data to request
 * @param retries Number of requests to try
 * @returns Return the result data of the request
 */
export const handlePostRequest = async (url: string, formData: FormData, retries = 3) => {
  axiosRetry(axios, {
    retries: retries,
    shouldResetTimeout: true,
    retryDelay: (retryCount) => {
      console.log(`retry attempt: ${retryCount}`)
      return retryCount * 2000
    },
    retryCondition: () => true,
  })

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response?.data
  } catch (e) {
    Logger.error(e)
    throw new ClientError((e as any).message, 'Catalog')
  }
}

export const getSubscriptionsAndServices = async (subscriptionsDDOs: DDO[], sdk: Nevermined) => {
  return Promise.all(
    subscriptionsDDOs.map(async (ddo) => {
      const query = await sdk.search.servicesBySubscription(ddo.id)

      return {
        subscription: ddo,
        services: query.results,
      }
    }),
  )
}

export const executeWithProgressEvent = async <T>(
  subscribableAction: () => SubscribablePromise<any, T>,
  onEvent?: (next: any) => void,
) => {
  let subscription: { unsubscribe: () => boolean } | undefined

  try {
    const subscribablePromise = subscribableAction()
    subscription = onEvent ? subscribablePromise.subscribe(onEvent) : undefined
    return await subscribablePromise
  } finally {
    subscription?.unsubscribe()
  }
}
