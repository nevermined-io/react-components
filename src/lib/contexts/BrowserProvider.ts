import { useState, createContext, useEffect } from 'react';
import { provider } from 'web3-core';
import { Logger } from '@nevermined-io/nevermined-sdk-js';
import { zeroX } from '@nevermined-io/nevermined-sdk-js/dist/node/utils';
import Web3 from 'web3';
import { acceptedChainId, nodeUri } from 'config';
import ChainConfig from 'chain_config';

const acceptedChainIdHex = zeroX((+acceptedChainId).toString(16));

export interface Web3Manager {
  startLogin: () => Promise<string[]>;
  isLoggedIn: () => Promise<boolean>;
  isAvailable: () => boolean;
}

interface WalletProviderState {
  getProvider: () => Web3;
  logout: () => void;
  isLogged: () => Promise<boolean>;
  isAvailable: () => boolean;
  promptSwitchAccounts: () => Promise<void>;
  walletAddress: string;
  loginMetamask: () => Promise<void>;
}

export const WalletContext = createContext({} as WalletProviderState);

export const useWeb3Manager = (
  web3: Web3
): {
  startLogin: () => Promise<string[]>;
  isLoggedIn: () => Promise<boolean>;
  isAvailable: () => boolean;
} => {
  const isAvailable = (): boolean => web3 !== null;

  const isLoggedIn = async (): Promise<boolean> => {
    if (!isAvailable() && !web3?.eth?.getAccounts) return false;
    const accounts = await web3?.eth?.getAccounts();
    return accounts && accounts?.length > 0;
  };

  const startLogin = async (): Promise<string[]> => {
    try {
      const response = await window.ethereum.request<string[]>({
        method: 'eth_requestAccounts'
      });
      if (!response?.length || !response[0]) {
        return [];
      }
      //@ts-ignore
      return response;
    } catch (error) {
      return await Promise.reject(error);
    }
  };

  const IState = {
    startLogin,
    isLoggedIn,
    isAvailable
  };

  return { ...IState };
};



  //const useSwitchChainsListener = () => {
    //useEffect(() => {
      //const switchChainsOrRegisterSupportedChain = async (): Promise<void> => {
        //try {
          //await window.ethereum.request({
            //method: 'wallet_switchEthereumChain',
            //params: [
              //{
                //chainId: acceptedChainIdHex
              //}
            //]
          //});
        //} catch (switchError) {
          //if ((switchError as any).code === 4902) {
            //try {
              //const currentChainConfig = ChainConfig.returnConfig(acceptedChainIdHex);
              //const configParam = await window.ethereum.request({
                //method: 'wallet_addEthereumChain',
                //params: [currentChainConfig]
              //});
              //if (!configParam) {
                //console.log(`Chain ${acceptedChainId} added successfully!`);
              //}
            //} catch (addError) {
              //Logger.error(addError);
            //}
          //}
          //Logger.error(switchError);
        //}
      //};
      //switchChainsOrRegisterSupportedChain();
    //}, []);
  //};


// Web3.utils.toChecksumAddress(accounts[0])
