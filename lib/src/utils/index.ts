import { Account, Nevermined } from '@nevermined-io/nevermined-sdk-js';

// if empty returns true
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
