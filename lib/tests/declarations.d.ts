import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum: any;
    web3: ethers.providers.ExternalProvider;
  }
}
