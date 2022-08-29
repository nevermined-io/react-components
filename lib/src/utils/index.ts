import { Account, DDO, Nevermined, Logger, ClientError } from '@nevermined-io/nevermined-sdk-js';
import axios from 'axios'
import axiosRetry from 'axios-retry'

interface FulfilledOrders {
  documentId: string;
}


/**
 * Checks if object is empty
 * @param i Object to check
 * @return `true` if object is empty or undefined
 */
export const isEmptyObject = (i: any) => !i || Object.keys(i).length < 1;


/**
 * Returns current account registered in SDK
 * @param sdk Instance of SDK object
 */
export const getCurrentAccount = async (sdk: Nevermined) => {
  let accounts: Account[] = [];
  if (sdk.accounts) {
    accounts = await sdk.accounts.list();
    if (!accounts?.length) {
      accounts = await sdk.accounts.requestList();
    }
  }

  return accounts[0];
};

type Template = 'accessTemplate' | 'nft721AccessTemplate' | 'nftAccessTemplate';

type Condition = 'accessCondition' | 'nftAccessCondition';

/** 
 * Order transfer asset to a new owner
 * @param orderParams
 * @param orderParams.sdk Instance of SDK object
 * @param orderParams.ddo Asset object
 * @param orderParams.gatewayAddress Address of gateway to allow handle the asset transaction
 * @param orderParams.newOwner Address of the new owner who will be transferred the asset
 * @return Agreement id generated after order an asset
 */
export const conductOrder = async ({
  sdk,
  ddo,
  gatewayAddress,
  newOwner
}: {
  sdk: Nevermined;
  gatewayAddress: string;
  ddo: DDO;
  newOwner: Account;
}): Promise<string> => {
  try {
    Logger.log('Checking if USDC spending is approved.');
    const isApproved = await sdk.keeper.nftUpgradeable.isApprovedForAll(
      newOwner.getId(),
      gatewayAddress
    );
    if (!isApproved) {
      const receipt = await sdk.nfts.setApprovalForAll(gatewayAddress, true, newOwner);
      Logger.log('Approval receipt:', receipt);
    }
    Logger.log('USDC spending is approved.');
    Logger.log(`Asking for approval and locking payment for USDC.`);
    const agreementId: string = await sdk.nfts.order(ddo.id, 1, newOwner);
    Logger.log('Transferring the NFT.');
    Logger.log('Order agreement ID', agreementId);
    return agreementId;
  } catch (error) {
    console.error(error);
    return '';
  }
};

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
): Promise<FulfilledOrders[]> => {
  const fulfilled = await sdk.keeper.conditions[condition].events.getPastEvents({
    methodName: 'getFulfilleds',
    eventName: 'Fulfilled',
    filterSubgraph: {
      where: {
        _grantee: account
      }
    },
    filterJsonRpc: { _grantee: account },
    result: {
      _documentId: true
    }
  });

  return fulfilled.map((doc) => ({ documentId: doc._documentId }));
};

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
) => {
  const agreements = await sdk.keeper.templates[template].events.getPastEvents({
    methodName: 'getAgreementCreateds',
    eventName: 'AgreementCreated',
    filterSubgraph: {
      where: {
        _did: did,
      }
    },
    filterJsonRpc: {},
    result: {
      _agreementId: true,
      _creator: true,
      _did: true
    }
  });

  return agreements[0];
};

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
    retryCondition: () => true
  })

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response?.data
  } catch (e) {
    Logger.error(e)
    throw new ClientError((e as any).message, 'Catalog');
  }
}
