import React, { createContext, useContext } from 'react';
import { useState, useCallback, useEffect } from 'react';
import { Nevermined, Config } from '@nevermined-io/nevermined-sdk-js';
import { BrowserProvider } from './BrowserProvider';

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

function useNeverminedService(config: Config): { sdk: Nevermined; isLoading: boolean } {
  const { wallet } = useWeb3Service();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sdk, setSdk] = useState({} as Nevermined);
  // Load Nevermined SDK
  const loadNevermined = useCallback(async (): Promise<void> => {
    if (!wallet.isAvailable) return;
    const isWeb3Available = await wallet?.isAvailable();
    if (isWeb3Available) {
      const web3 = wallet.getProvider();
      const nvmSdk: any = await Nevermined.getInstance({
        ...config,
        web3Provider: web3
      });
      setSdk(nvmSdk);
      setIsLoading(false);
    }
  }, [wallet, config]);

  useEffect(() => {
    loadNevermined();
  }, [loadNevermined]);

  return {
    isLoading,
    sdk
  };
}

export type NeverminedServiceContext = ReturnType<typeof useNeverminedService>;

// Fetch network name
//  useEffect(() => {
//  if (!chainId || !sdk?.keeper) {
//  return;
//  }
// sdk.keeper.getNetworkName().then(setNetworkName);
// }, [address, sdk]);
//
//
//
//
//// Fetch account using current address
//useEffect(() => {
////if (!address || !sdk?.accounts) {
////return;
////}
//if (!sdk?.accounts) return;
//sdk.accounts?.list().then(([sdkAccount]) => {
//if (account) {
//const accountFetched = sdkAccount.getId();
//
//if (account && accountFetched.toLowerCase() !== account.getId().toLowerCase()) {
//setAccount(sdkAccount);
//}
//return updateBalance(sdkAccount);
//}
//});
//}, [sdk]);
//
//
//
//// Update balance function
//const updateBalance = useCallback(
//async (balanceAccount: Account) => {
//const balanceFetched = await balanceAccount.getBalance();
//const { eth, nevermined } = balance;
////@ts-ignore
//if (eth !== balanceFetched.eth || nevermined !== balanceFetched.nevermined) {
////@ts-ignore
//setBalance(balanceFetched);
//}
//},
//[balance]
//);

export type NeverminedProviderContext = NeverminedServiceContext;

interface NeverminedProviderProps {
  children: React.ReactNode;
  config: Config;
}
const NeverminedContext = createContext({} as NeverminedProviderContext);

export const NeverminedProvider = ({
  children,
  config
}: NeverminedProviderProps): React.ReactElement => {
  const neverminedContext = useNeverminedService(config);

  return (
    <NeverminedContext.Provider
      value={
        {
          ...neverminedContext
        } as NeverminedProviderContext
      }
    >
      {children}
    </NeverminedContext.Provider>
  );
};

export const useNevermined = (): NeverminedProviderContext => useContext(NeverminedContext);

export default NeverminedProvider;
