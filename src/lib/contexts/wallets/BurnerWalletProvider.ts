import Web3 from 'web3'
import HDWalletProvider from '@truffle/hdwallet-provider'
import { requestFromFaucet } from '../../utils/requestFromFaucet';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const bip39 = require('bip39')

export default class BurnerWalletProvider {
  private web3: Web3

  public constructor(private nodeUri: string) {
    // Default
    this.web3 = null as any
  }

  // eslint-disable-next-line class-methods-use-this
  public async isLoggedIn(): Promise<boolean> {
    if (localStorage.getItem('seedphrase') !== null) {
      return true
    }
    return false
  }

  public async startLogin(): Promise<void> {
    if (!await this.isLoggedIn()) {
      console.error('BurnerWallet needs "seedphrase" on localStorage. Use this only for testing purposes.')
      return
    }

    const mnemonic = localStorage.getItem('seedphrase') as string

    const provider = new HDWalletProvider(mnemonic, this.nodeUri, 0, 1)
    this.web3 = new Web3(provider as any)
    const accounts = await this.web3.eth.getAccounts()
    const balance = await this.web3.eth.getBalance(accounts[0])
    if (balance === '0') {
      // TODO: Check if faucet makes sense and ensure that faucet URL is part of the config
      // await requestFromFaucet(accounts[0])
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public async logout(): Promise<void> {
    // localStorage.removeItem('seedphrase')
    localStorage.removeItem('logType')
  }

  public getProvider(): any {
    return this.web3
  }
}
