import { Ethereumish } from './types';
import Web3 from 'web3';

declare global {
  interface Window {
    ethereum: Ethereumish;
    web3: Web3;
  }
}
