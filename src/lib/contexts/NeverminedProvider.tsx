import React, { createContext, useContext } from 'react';
import { useState, useCallback, useEffect } from 'react';
import { Nevermined, Config } from '@nevermined-io/nevermined-sdk-js';
import { useWeb3Manager, Web3Manager } from './BrowserProvider';
import Web3 from 'web3';
import { TokenUtilsService } from 'lib/hooks/UseTokenUtilsManager';

const initWeb3 = (): Web3 => {
  const provider = window?.ethereum
    ? window.ethereum
    : //@ts-ignore
    window?.web3
    ? //@ts-ignore
      window.web3.currentProvider
    : //@ts-ignore
      Web3.providers.HttpProvider(nodeUri); // default provider
  const web3 = new Web3(provider);
  return web3;
};

const useNeverminedService = (
  config: Config,
  web3Provider: Web3
): { sdk: Nevermined; isLoading: boolean } => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sdk, setSdk] = useState({} as Nevermined);

  useEffect(() => {
    const loadNevermined = async (): Promise<void> => {
      if (
        !web3Provider ||
        !config ||
        Object.keys(web3Provider).length < 1 ||
        Object.keys(config).length < 1 ||
        Object.keys(sdk).length > 0
      )
        return;

      console.log('config', config)
      console.log('web3Provider', web3Provider)
      setIsLoading(true);
      const nvmSdk: any = await Nevermined.getInstance({
        ...config,
        web3Provider
      });
      setSdk(nvmSdk);
      setIsLoading(false);
    };

    loadNevermined();
  }, [web3Provider, config]);

  return {
    isLoading,
    sdk
  };
};

export interface NeverminedProviderContext {
  sdk: Nevermined;
  web3Manager: Web3Manager;
  tokenUtils: TokenUtilsService;
}

interface NeverminedProviderProps {
  children: React.ReactNode;
  config: Config;
}

const useAccountsChangedListener = () => {
  useEffect(() => {
    const registerOnAccounsChangedListener = async (): Promise<void> => {
      console.log('here');
      //@ts-ignore
      window.ethereum.on('accountsChanged', (newAccount: string[]) => {
        console.log('newAccount', newAccount);
        if (newAccount && newAccount.length > 0) {
          //           setWalletAddress(Web3.utils.toChecksumAddress(newAccount[0]));
        } else {
          //         user disconneted via metamask
          //         setWalletAddress('');
          console.log('No Account found!');
        }
      });
    };

    registerOnAccounsChangedListener();
  }, []);
};

const NeverminedContext = createContext({} as NeverminedProviderContext);

export const NeverminedProvider = ({
  children,
  config
}: NeverminedProviderProps): React.ReactElement => {
  const web3Provider = initWeb3();
  const neverminedContext = useNeverminedService(config, web3Provider);
  const [tokenUtilsService, setTokenUtilsService] = useState<TokenUtilsService>();
  const web3Manager = useWeb3Manager(web3Provider);
  // useAccountsChangedListener();

  //useEffect(() => {
  //const handler = async () => {
  //const isWeb3Available = await web3Manager?.isAvailable();
  //if (isWeb3Available) {
  //setTokenUtilsService(new TokenUtilsService(web3Provider));
  //}
  //};
  //handler();
  //}, [web3Manager, web3Provider]);

  return (
    <NeverminedContext.Provider
      value={
        {
          ...neverminedContext,
          web3Manager,
          tokenUtils: tokenUtilsService
        } as NeverminedProviderContext
      }
    >
      {children}
    </NeverminedContext.Provider>
  );
};

export const useNevermined = (): NeverminedProviderContext => useContext(NeverminedContext);

export default NeverminedProvider;

//
// const cid = await wallet.getProvider().eth.getChainId();
//   setChainId(cid);
// setWeb3((browserProvider as any).web3);
//
//

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
