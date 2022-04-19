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
