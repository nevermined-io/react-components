import React, { useEffect, useState } from 'react'
import { render, screen, renderHook, waitFor } from '@testing-library/react'
import { generateTestingUtils } from "eth-testing"
import { MetaMask } from '../src'
import { ChainConfig } from './chainConfig'
import { MetamaskProvider } from '../src/metamask'

const WALLET_ADDRESS = "0xf61B443A155b07D2b2cAeA2d99715dC84E839EEf"

const setup = () => render(
    <MetaMask.WalletProvider externalChainConfig={ChainConfig} correctNetworkId='0x13881' nodeUri='http://localhost:8545'>
      <div>Hello metamask</div>
    </MetaMask.WalletProvider>
)

const wrapperProvider = ({ children }: { children: React.ReactElement }) => (
  <MetaMask.WalletProvider externalChainConfig={ChainConfig} correctNetworkId='0x13881' nodeUri='http://localhost:8545'>
    {children}
  </MetaMask.WalletProvider>
)


describe('Metamask context', () => {
  const testingUtils = generateTestingUtils({ providerType: "MetaMask" })
  beforeAll(() => {
    global.window.ethereum = testingUtils.getProvider()
  })

  afterEach(() => {
    testingUtils.clearAllMocks()
  })


  it('Component load', () => {
    testingUtils.mockConnectedWallet([WALLET_ADDRESS])
    setup()
    expect(screen.getByText('Hello metamask')).toBeInTheDocument()
  })

  it('should login metamask', async () => {
    testingUtils.mockConnectedWallet([WALLET_ADDRESS])

    const { result } = renderHook(
      () => {
        const { walletAddress, loginMetamask } = MetaMask.useWallet()

        useEffect(() => {
          (async () => {
            if(!walletAddress) {
              await loginMetamask()
            }
          })()
        }, [walletAddress])

        return walletAddress
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toBe(WALLET_ADDRESS)
    })
  })

  it('should logout', async() => {
    testingUtils.mockConnectedWallet([WALLET_ADDRESS])

    const { result } = renderHook(
      () => {
        const { walletAddress, loginMetamask, logout } = MetaMask.useWallet()

        useEffect(() => {
          (async () => {
            if(!walletAddress) {
              await loginMetamask()
            } else {
              await logout()
            }
          })()
        }, [walletAddress])

        return walletAddress
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toBe('')
    })
  })

  it('should get provider', async () => {
    testingUtils.mockConnectedWallet([WALLET_ADDRESS])

    const { result } = renderHook(
      () => {
        const { walletAddress, loginMetamask, getProvider } = MetaMask.useWallet()
        const [provider, setProvider] = useState<MetamaskProvider>()

        useEffect(() => {
          (async () => {
            if(!walletAddress) {
              await loginMetamask()
            } else {
              const result = getProvider()
              setProvider(result)
            }
          })()
        }, [provider, walletAddress])

        return provider
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current?._network.name).toBe('homestead')
    })
  })

  it("should return checkIsLogged true if the wallet is connected", async () => {
    testingUtils.mockConnectedWallet([WALLET_ADDRESS])

    const { result } = renderHook(
      () => {
        const { walletAddress, loginMetamask, checkIsLogged } = MetaMask.useWallet()
        const [logged, setLogged] = useState(false)

        useEffect(() => {
          (async () => {
            if(!walletAddress) {
              await loginMetamask()
            } else {
              const result = await checkIsLogged()
              setLogged(result)
            }
          })()
        }, [ walletAddress ])

        return logged
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toBe(true)
    })
  })

  it("should return checkIsLogged false if the wallet is not connected", async () => {
    testingUtils.mockConnectedWallet([WALLET_ADDRESS])

    const { result } = renderHook(
      () => {
        const { walletAddress, checkIsLogged } = MetaMask.useWallet()
        const [logged, setLogged] = useState(false)

        useEffect(() => {
          (async () => {
            const result = await checkIsLogged()
            setLogged(result)
          })()
        }, [ walletAddress ])

        return logged
      },
      {
        wrapper: wrapperProvider
      }
    )

    await waitFor(async () => {
      expect(result.current).toBe(false)
    })
  })
})