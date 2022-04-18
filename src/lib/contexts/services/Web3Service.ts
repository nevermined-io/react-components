import { useEffect, useState } from 'react';
import { BrowserProvider } from '../wallets/BrowserProvider';

export function useWeb3Service(): { wallet: BrowserProvider} {
  const [wallet, setWallet] = useState<BrowserProvider>({} as BrowserProvider);
  const initialize = async () => {
    const onAccountChange = (address: string) => {
      console.log('onaccountchange');
    };

    const onNetworkChange = (chainId: string) => {
      console.log(chainId);
    };
    const browserProvider: BrowserProvider = new BrowserProvider();
    await browserProvider.startLogin();

    browserProvider.onAccountChange(onAccountChange);
    browserProvider.onNetworkChange(onNetworkChange);

    setWallet(browserProvider);
  };

  useEffect(() => {
    initialize();
  }, []);

  return { wallet };
}

export type Web3ServiceContext = ReturnType<typeof useWeb3Service>;
//
// const cid = await wallet.getProvider().eth.getChainId();
//   setChainId(cid);
// setWeb3((browserProvider as any).web3);
