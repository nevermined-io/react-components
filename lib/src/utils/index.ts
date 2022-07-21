import { Account, DDO, Nevermined, Logger } from '@nevermined-io/nevermined-sdk-js';

export const isEmptyObject = (i: any) => !i || Object.keys(i).length < 1;

export const convertHextoIntString = (hex: string) => {
  const removedAddressFormat = hex.replace('0x', '');
  const intString = parseInt(removedAddressFormat, 16);

  return intString.toString();
};

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
