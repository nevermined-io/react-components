import Web3 from 'web3';

export const isEmptyObject = (i: any) => !i || Object.keys(i).length < 1;

export const promptSwitchAccounts = async () => window.ethereum.request({
    method: 'wallet_requestPermissions',
    params: [
        {
            eth_accounts: {}
        }
    ]
});
;

export const checksumAddress = (address: string): string => Web3.utils.toChecksumAddress(address);
