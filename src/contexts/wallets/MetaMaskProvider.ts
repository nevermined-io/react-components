import Web3 from 'web3'

// eslint-disable-next-line import/prefer-default-export
class MetamaskProvider {
  private web3: Web3

  public constructor() {
    // Default
    this.web3 = null as any
    // Modern dapp browsers
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum)
      console.log(this.web3)
    }
    // Legacy dapp browsers
    else if (window.web3) {
      this.web3 = new Web3(window.web3.currentProvider)
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

  // eslint-disable-next-line class-methods-use-this
  public async startLogin(): Promise<string[]> {
    try {
      const response = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if (response) {
        localStorage.setItem('logType', 'Metamask')
      }
      return response
    } catch (error) {
      return await Promise.reject(error)
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public async logout(): Promise<void> {
    localStorage.removeItem('logType')
  }

  public getProvider(): any {
    return this.web3
  }
}

export default new MetamaskProvider();
