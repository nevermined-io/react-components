import React, { useEffect, useState } from 'react'
import { configureChains, createClient, Chain } from 'wagmi'
import { MockConnector } from 'wagmi/connectors/mock'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { renderHook, waitFor, render, act, screen } from '@testing-library/react'
import { generateTestingUtils } from 'eth-testing'
import { ethers } from 'ethers'
import { WalletProvider, useWallet, Ethers } from '../src'
import ChainsConfig from './chainConfig'

// const setup = (client: Client<any>) => {
//   <WalletProvider client={client} correctNetworkId={80001}>
//     <div>Hello Metamask</div>
//   </WalletProvider>
// } 

const wrapperProvider = ({ children, signer }: { children: React.ReactElement, signer: ethers.Signer }) => {
  try {
    const { provider, chains} = configureChains(
      ChainsConfig,
      [
          jsonRpcProvider({
              rpc: (chain) => {
                  if(!ChainsConfig.some(c => c.id === chain.id)) return null
  
                  return {
                      http: chain.rpcUrls.default
                  }
              }
          })
      ]    
    )
  
    const connectors = [new MockConnector({
      chains,
      options: {
        signer,
      }
    })]
  
    const client = createClient({
      autoConnect: true,
      connectors,
      provider,
    })
  
    return (
      <WalletProvider client={client}>
        {children}
      </WalletProvider>
    )
  } catch (error) {
    console.error(error)
    return <></>
  }
}

describe('Metamask context', () => {
  const testingUtils = generateTestingUtils({ providerType: "MetaMask" })
  
  beforeAll(() => {
    // eslint-disable-next-line
    (global.window as any).ethereum = testingUtils.getProvider()
  })

  afterEach(() => {
    testingUtils.clearAllMocks()
  })


  it('should component load', async () => {
    const mockWallet = ethers.Wallet.createRandom()
    testingUtils.mockConnectedWallet([mockWallet.address])

    act(() => {
      render(wrapperProvider({children: <div>Hello Metamask</div>, signer: mockWallet}))
    })

    await waitFor(async () => {
      expect(screen.getByText('Hello Metamask')).toBeInTheDocument()
    })
  })

  it('should login metamask', async () => {
    const mockWallet = ethers.Wallet.createRandom()
    testingUtils.mockConnectedWallet([mockWallet.address])

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
        wrapper: (props: {
          children: React.ReactElement
        }) => wrapperProvider({children: props.children, signer: mockWallet})
      }
    )

    await waitFor(async () => {
      expect(result.current).toBe(mockWallet.address)
    })
  })

  it('should logout', async() => {
    const mockWallet = ethers.Wallet.createRandom()
    testingUtils.mockConnectedWallet([mockWallet.address])

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
        wrapper: (props: {
          children: React.ReactElement
        }) => wrapperProvider({children: props.children, signer: mockWallet})
      }
    )

    await waitFor(async () => {
      expect(result.current).toBe('')
    })
  })

  it('should get provider', async () => {
    const mockWallet = ethers.Wallet.createRandom()
    testingUtils.mockConnectedWallet([mockWallet.address])

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
        wrapper: (props: {
          children: React.ReactElement
        }) => wrapperProvider({children: props.children, signer: mockWallet})
      }
    )

    await waitFor(async () => {
      expect((await result.current?.getNetwork())?.name).toBe('matic')
    })
  })

  it("should return getStatus connected if the wallet is connected", async () => {
    const mockWallet = ethers.Wallet.createRandom()
    testingUtils.mockConnectedWallet([mockWallet.address])

    const { result } = renderHook(
      () => {
        const { walletAddress, login, getStatus } = useWallet()
        const [status, setStatus] = useState<"connecting" | "connected" | "reconnecting" | "disconnected" | undefined>()

        useEffect(() => {
          (async () => {
            if(!walletAddress) {
              await login()
            } else {
              const result = getStatus()
              setStatus(result)
            }
          })()
        }, [ walletAddress ])

        return status
      },
      {
        wrapper: (props: {
          children: React.ReactElement
        }) => wrapperProvider({children: props.children, signer: mockWallet})
      }
    )

    await waitFor(async () => {
      expect(result.current).toBe('connected')
    })
  })

  it('should get all the available chains', async() => {
    const mockWallet = ethers.Wallet.createRandom()
    testingUtils.mockConnectedWallet([mockWallet.address])

    const { result } = renderHook(
      () => {
        const { walletAddress, login, getAllAvailableChains } = useWallet()
        const [chains, setChains] = useState<Chain[]>([])

        useEffect(() => {
          (async () => {
            if(!walletAddress) {
              await login()
            } else {
              const result = getAllAvailableChains()
              setChains(result)
            }
          })()
        }, [ walletAddress ])

        return chains
      },
      {
        wrapper: (props: {
          children: React.ReactElement
        }) => wrapperProvider({children: props.children, signer: mockWallet})
      }
    )

    await waitFor(async () => {
      expect(result.current).toStrictEqual(ChainsConfig)
    })
  })

  it("should return getStatus disconnected if the wallet is not connected", async () => {
    const mockWallet = ethers.Wallet.createRandom()
    testingUtils.mockConnectedWallet([mockWallet.address])

    const { result } = renderHook(
      () => {
        const { walletAddress, logout, getStatus } = useWallet()
        const [status, setStatus] = useState<"connecting" | "connected" | "reconnecting" | "disconnected" | undefined>()

        useEffect(() => {
          (async () => {
            await logout()
            const result = await getStatus()
            setStatus(result)
          })()
        }, [ walletAddress ])

        return status
      },
      {
        wrapper: (props: {
          children: React.ReactElement
        }) => wrapperProvider({children: props.children, signer: mockWallet})
      }
    )

    await waitFor(async () => {
      expect(result.current).toBe("disconnected")
    })
  })
})