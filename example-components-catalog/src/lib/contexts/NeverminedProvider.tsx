import React, { useState, useEffect, createContext, useContext } from 'react';
import { Nevermined, Config } from '@nevermined-io/nevermined-sdk-js';
import Web3 from 'web3';
import { TokenUtilsService } from 'lib/hooks/UseTokenUtilsManager';
import initWeb3 from 'lib/services/web3_provider';
import { NeverminedProviderContext, NeverminedProviderProps } from 'lib/types';
import { useWeb3Manager } from 'lib/hooks/UseWeb3Manager';

const useNeverminedService = (
  config: Config,
  web3Provider: Web3
): { sdk: Nevermined; isLoading: boolean } => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sdk, setSdk] = useState({} as Nevermined);

  useEffect(() => {
    const loadNevermined = async (): Promise<void> => {
      const invalidInputs =
        !web3Provider ||
        !config ||
        Object.keys(web3Provider).length < 1 ||
        Object.keys(config).length < 1;
      if (invalidInputs) return;
      console.log('Start Loading SDK..');
      setIsLoading(true);
      const nvmSdk: any = await Nevermined.getInstance({
        ...config,
        web3Provider
      });
      setSdk(nvmSdk);
      console.log('Loading SDK Finished:', nvmSdk);
      setIsLoading(false);
    };

    const sdkAlreadyLoaded = Object.keys(sdk).length > 0;
    !sdkAlreadyLoaded && loadNevermined();
  }, [web3Provider, config]);

  return {
    isLoading,
    sdk
  };
};

const NeverminedContext = createContext({} as NeverminedProviderContext);

export const NeverminedProvider = ({
  children,
  config
}: NeverminedProviderProps): React.ReactElement => {
  const web3Provider = initWeb3();
  const { sdk, isLoading } = useNeverminedService(config, web3Provider);
  const [tokenUtilsService] = useState<TokenUtilsService>();
  const web3Manager = useWeb3Manager(web3Provider);

  return (
    <NeverminedContext.Provider
      value={
        {
          sdk,
          web3Manager,
          tokenUtils: tokenUtilsService,
          web3Provider
        } as NeverminedProviderContext
      }
    >
      {children}
    </NeverminedContext.Provider>
  );
};

export const useNevermined = (): NeverminedProviderContext => useContext(NeverminedContext);

export default NeverminedProvider;

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
//
//
//

//useEffect(() => {
//const handler = async () => {
//const isWeb3Available = await web3Manager?.isAvailable();
//if (isWeb3Available) {
//setTokenUtilsService(new TokenUtilsService(web3Provider));
//}
//};
//handler();
//}, [web3Manager, web3Provider]);
