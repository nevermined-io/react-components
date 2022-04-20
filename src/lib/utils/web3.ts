import Web3 from 'web3';

export const promptSwitchAccounts = async () => {
  await window.ethereum.request({
    method: 'wallet_requestPermissions',
    params: [
      {
        eth_accounts: {}
      }
    ]
  });
};

export const formatAddress = (address: string): string => Web3.utils.toChecksumAddress(address);
