import React, { useEffect, useState } from 'react'
import { render, screen, renderHook, waitFor } from '@testing-library/react'
import { generateTestingUtils } from "eth-testing"
import { WalletProvider, useWallet, Ethers } from '../src'
import ChainConfig from './chainConfig'

const WALLET_ADDRESS = "0xf61B443A155b07D2b2cAeA2d99715dC84E839EEf"

const setup = () => render(
    <WalletProvider externalChainConfig={ChainConfig} correctNetworkId={80001}>
      <div>Hello metamask</div>
    </WalletProvider>
)

const wrapperProvider = ({ children }: { children: React.ReactElement }) => (
  <WalletProvider externalChainConfig={ChainConfig} correctNetworkId={80001}>
    {children}
  </WalletProvider>
)

describe('Metamask context', () => {
  const testingUtils = generateTestingUtils({ providerType: "MetaMask" })
  beforeAll(() => {
    // eslint-disable-next-line
    (global.window as any).ethereum = testingUtils.getProvider()
  })

  beforeEach(() => {
    jest.useFakeTimers()
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
        const { walletAddress, login } = useWallet()

        useEffect(() => {
          (async () => {
            if(!walletAddress) {
              await login()
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
        const { walletAddress, login, logout } = useWallet()

        useEffect(() => {
          (async () => {
            if(!walletAddress) {
              await login()
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
        const { walletAddress, login, getProvider } = useWallet()
        const [provider, setProvider] = useState<Ethers.providers.Provider>()

        useEffect(() => {
          (async () => {
            if(!walletAddress) {
              await login()
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
      expect((await result.current?.getNetwork())?.name).toBe('homestead')
    })
  })

  it("should return getStatus connected if the wallet is connected", async () => {
    testingUtils.mockConnectedWallet([WALLET_ADDRESS])

    const { result } = renderHook(
      () => {
        const { walletAddress, login, getStatus } = useWallet()
        const [logged, setLogged] = useState<"connecting" | "connected" | "reconnecting" | "disconnected" | undefined>()

        useEffect(() => {
          (async () => {
            if(!walletAddress) {
              await login()
            } else {
              const result = getStatus()
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
      expect(result.current).toBe('connected')
    })
  })

  it("should return getStatus disconnected if the wallet is not connected", async () => {
    testingUtils.mockConnectedWallet([WALLET_ADDRESS])

    const { result } = renderHook(
      () => {
        const { walletAddress, getStatus } = useWallet()
        const [logged, setLogged] = useState<"connecting" | "connected" | "reconnecting" | "disconnected" | undefined>()

        useEffect(() => {
          (async () => {
            const result = await getStatus()
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
      expect(result.current).toBe("disconnected")
    })
  })
})