import Web3 from 'web3'
import { Eth } from 'web3/eth'

declare global {
    interface Window {
        web3: Web3
        ethereum: Eth
    }
}
