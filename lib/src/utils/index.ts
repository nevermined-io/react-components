import { Account, DDO, Nevermined, Logger } from '@nevermined-io/nevermined-sdk-js';

interface FullfilledOrders {
  documentId: string;
}

export const isEmptyObject = (i: any) => !i || Object.keys(i).length < 1;

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

export const loadFullfilledEvents = async (
  sdk: Nevermined,
  account: string
): Promise<FullfilledOrders[]> => {
  const fullfilled = await sdk.keeper.conditions.accessCondition.events.getPastEvents({
    methodName: 'getFulfilleds',
    filterSubgraph: {
      where: {
        _grantee: account
      }
    },
    result: {
      _documentId: true
    }
  });

  return fullfilled.map((doc) => ({ documentId: doc._documentId }));
};

export const getAgreementId = async (
  sdk: Nevermined,
  template: Template,
  did: string,
  account: string
) => {
  const agreements = await sdk.keeper.templates[template].events.getPastEvents({
    methodName: 'agreementCreateds',
    result: {
      _agreementId: true,
      _creator: true,
      _did: true
    }
  });

  return agreements.find((a) => a._did === did && a._creator === account)?._agreementId;
};
