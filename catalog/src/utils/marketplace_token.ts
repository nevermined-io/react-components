import { Nevermined, Logger } from '@nevermined-io/sdk'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { MarketplaceAPIToken } from '../types'

export const MARKETPLACE_API_TOKEN = 'marketplaceApiToken'

/**
 * Save Marketplace API token to local storage
 * @param i Auth token object which is generated from Marketplace API
 */
export const saveMarketplaceApiTokenToLocalStorage = (i: MarketplaceAPIToken): void => {
  if (!window?.localStorage) {
    console.warn('Setting Marketplace Api token: Window object is not ready or it is missed')
    return
  }

  localStorage.setItem(MARKETPLACE_API_TOKEN, JSON.stringify({ token: i.token }))
}

/**
 * Get Marketplace API token to local storage
 *
 * @return Auth token object which generated from Marketplace API
 */
export const fetchMarketplaceApiTokenFromLocalStorage = (): MarketplaceAPIToken => {
  let marketplaceApiTokenItem: string | null = null
  if (!window?.localStorage) {
    console.warn('Fetching Marketplace Api token: Window object is not ready or it is missing')
  } else {
    marketplaceApiTokenItem = localStorage.getItem('marketplaceApiToken')
  }

  if (marketplaceApiTokenItem) {
    return JSON.parse(marketplaceApiTokenItem)
  }

  return {
    token: '',
  }
}

/**
 * Generate new Marketplace API API token
 * @param sdk Instance of SDK object
 * @return Auth token object which generated from Marketplace API
 */
export const newMarketplaceApiToken = async (sdk: Nevermined): Promise<MarketplaceAPIToken> => {
  try {
    const [account] = await sdk.accounts.list()
    const credential = await sdk.utils.jwt.generateClientAssertion(account)
    const token = await sdk.services.marketplace.login(credential)
    saveMarketplaceApiTokenToLocalStorage({ token })
    return { token }
  } catch (error) {
    Logger.error(error)
    return { token: '' }
  }
}

/**
 * Check if Marketplace API Token is valid
 * @return Return `true` if token is valid
 */
export const isTokenValid = () => {
  try {
    const { token } = fetchMarketplaceApiTokenFromLocalStorage()
    if (token && jwt.decode(token)) {
      const decodedToken = jwt.decode(token)
      const expiry = (decodedToken as JwtPayload)?.exp
      if (expiry) {
        const now = new Date()
        return now.getTime() < Number(expiry) * 1000
      }
    }
    return false
  } catch (error) {
    Logger.error(error)
    return false
  }
}

/**
 * Return the address that sign the token
 * @return The address token signer
 */
export const getAddressTokenSigner = () => {
  try {
    const { token } = fetchMarketplaceApiTokenFromLocalStorage()
    if (token) {
      const decodedToken = jwt.decode(token) as JwtPayload

      return decodedToken?.iss
    }
  } catch (error) {
    Logger.error(error)
  }
}