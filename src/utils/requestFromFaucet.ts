import { Logger } from '@nevermined-io/nevermined-sdk-js';
import config from "../config";

const faucetUri = config.neverminedConfig;
//
// Faucet
//
export interface FaucetResponse {
  success: boolean
  message: string
  trxHash?: string
}

export async function requestFromFaucet(account: string): Promise<any> {
  try {
    const url = `${faucetUri}/faucet`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address: account,
        agent: 'marketplace'
      })
    })
    return await response.json()
  } catch (error) {
    const errorInstance = error as Error
    Logger.log('requestFromFaucet', errorInstance.message)
    return Promise.reject(errorInstance.message)
  }
}
