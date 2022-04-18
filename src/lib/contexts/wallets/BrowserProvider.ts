import Web3 from 'web3';
import { provider } from 'web3-core';

export class BrowserProvider {
  private web3: Web3;

  constructor() {
    // Default
    this.web3 = null as any;
    // Modern dapp browsers
    if (typeof window === 'undefined') {
      return;
    }
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum as provider);
      console.log(this.web3);
    }
  }

  async isAvailable(): Promise<boolean> {
    return this.web3 !== null;
  }

  async getAccountString(): Promise<string> {
    if (this.web3 === null) {
      return '';
    }
    const accounts = await this?.web3?.eth?.getAccounts();
    return accounts?.length ? accounts[0] : '';
  }

  async isLoggedIn(): Promise<boolean> {
    if (this.web3 === null) {
      return false;
    }
    if ((await this.web3.eth.getAccounts()).length > 0) {
      return true;
    }
    return false;
  }

  async startLogin() {
    try {
      await window.ethereum?.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      return await Promise.reject(error);
    }
  }

  async logout() {}

  getProvider(): Web3 {
    return this.web3;
  }

  onAccountChange(cb: (account: string) => void) {
    window.ethereum?.on('accountsChanged', (([account]: string[]) => cb(account)) as any);
  }

  onNetworkChange(cb: (chainId: string) => void) {
    window.ethereum?.on('chainChanged', ((chainId: string) => cb(chainId)) as any);
  }
}

