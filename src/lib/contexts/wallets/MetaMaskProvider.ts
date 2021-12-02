import Web3 from 'web3'
import { provider } from 'web3-core'

// eslint-disable-next-line import/prefer-default-export
class MetamaskProvider {
  private web3: Web3

  public constructor() {
    // Default
    this.web3 = null as any
    // Modern dapp browsers
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum as provider)
      console.log(this.web3)
    }
  }

  public async isAvailable(): Promise<boolean> {
    return this.web3 !== null
  }

  public async isLogged(): Promise<boolean> {
    if (this.web3 === null) return false
    if ((await this.web3.eth.getAccounts()).length > 0) {
      return true
    }
    return false
  }

  public async startLogin() {
    try {
      const response = await window.ethereum?.request({ method: 'eth_requestAccounts' })
      if (response) {
        localStorage.setItem('logType', 'Metamask')
      }
    } catch (error) {
      return await Promise.reject(error)
    }
  }

  public async logout() {
    localStorage.removeItem('logType')
  }

  public getProvider(): any {
    return this.web3
  }
}

export default new MetamaskProvider();
