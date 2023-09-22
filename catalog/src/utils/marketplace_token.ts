import { Nevermined, Logger } from '@nevermined-io/sdk'
import jwt, { JwtPayload } from 'jsonwebtoken'

export const MARKETPLACE_API_TOKEN = 'marketplaceAPIToken'

/**
 * Get Marketplace API token to local storage
 *
 *
 * @return Auth token object which generated from Marketplace API
 */
export const fetchMarketplaceApiTokenFromLocalStorage = ({
  address,
  chainId,
}: {
  address: string
  chainId: number
}) => {
  if (!window?.localStorage) {
    Logger.warn('Fetching Marketplace Api token: Window object is not ready or it is missing')
    return ''
  }

  return localStorage.getItem(`${address}_${chainId}_${MARKETPLACE_API_TOKEN}`)
}

/**
 * Generate new Marketplace API API token
 *
 * @param address account address of the wallet
 * @param chainId the network Id
 * @param message Optional message to be included. Usually to be displayed in metamask
 * @param sdk Instance of SDK object
 *
 * @return Auth token object which generated from Marketplace API
 */
export const newMarketplaceApiToken = async ({
  address,
  chainId,
  message: _message,
  sdk,
}: {
  address: string
  chainId: number
  message?: string
  sdk: Nevermined
}) => {
  if (!window?.localStorage) {
    Logger.warn('Setting Marketplace Api token: Window object is not ready or it is missed')
    return false
  }

  try {
    const account = sdk.accounts.getAccount(address)
    const credential = await sdk.utils.jwt.generateClientAssertion(account)
    const token = await sdk.services.marketplace.login(credential)

    const tokenKey = `${address}_${chainId}_${MARKETPLACE_API_TOKEN}`

    localStorage.setItem(tokenKey, token)
    // eslint-disable-next-line consistent-return
    return true
  } catch (error: any) {
    Logger.error(error as string)
    return false
  }
}

/**
 * @param address account address of the wallet
 * @param chainId the network Id
 * Check if Marketplace API Token is valid
 * @return Return `true` if token is valid
 */
export const isTokenValid = ({ address, chainId }: { address: string; chainId: number }) => {
  const token = fetchMarketplaceApiTokenFromLocalStorage({ address, chainId })

  if (token) {
    const decodedToken = jwt.decode(token)

    const expiry = (decodedToken as JwtPayload)?.exp
    if (expiry) {
      const now = new Date()
      return now.getTime() < Number(expiry) * 1000
    }
  }

  return false
}

/**
 * Return the address that sign the token
 * @return The address token signer
 */
export const getAddressTokenSigner = ({
  address,
  chainId,
}: {
  address: string
  chainId: number
}) => {
  try {
    const token = fetchMarketplaceApiTokenFromLocalStorage({ address, chainId })
    if (token) {
      const decodedToken = jwt.decode(token) as JwtPayload

      return decodedToken?.iss
    }
  } catch (error) {
    Logger.error(error)
  }
}

/**
 * Save Marketplace API token to local storage
 * @param i Auth token object which is generated from Marketplace API
 */
export const saveMarketplaceApiTokenToLocalStorage = ({
  address,
  chainId,
  token,
}: {
  address: string
  chainId: number
  token: string
}): void => {
  if (!window?.localStorage) {
    console.warn('Setting Marketplace Api token: Window object is not ready or it is missed')
    return
  }

  localStorage.setItem(`${address}_${chainId}_${MARKETPLACE_API_TOKEN}`, token)
}
