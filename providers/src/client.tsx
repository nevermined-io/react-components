import React, {
  useState,
  useEffect,
  createContext,
  useContext
} from "react"
import { configureChains,
    Chain,
    createClient,
    Client,
    useAccount,
    useConnect,
    useNetwork,
    Connector,
    useDisconnect,
    useSwitchNetwork
} from "wagmi"
import { ConnectKitProvider } from 'connectkit/build/index'
import { Provider } from "@ethersproject/abstract-provider"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import ChainsConfig from './chain-config'
import { ConnectKitProviderProps } from './types'

/**
 * function that build and return the wagmi client
 * @param appName App name required for Coinbase wallet. If appName is undefined Coinbase wallet won't be supported
 * @param autoConnect If it is true once that the dapp start to run it will try to connect to the wallet automatically. Default `true`
 * @param chainsConfig Config with all the available chains that can be used in the dapp. Default chains supported `Polygon Mainnet`, `Polygon Mumbai`, `spree (localhost)
 * @returns 
 */
export const getClient = (appName = 'Nevermined', autoConnect = true, chainsConfig=ChainsConfig) => {
  const { provider, chains} = configureChains(
    chainsConfig,
    [
        jsonRpcProvider({
            rpc: (chain) => {
                if(!chainsConfig.some(c => c.id === chain.id)) return null

                return {
                    http: chain.rpcUrls.default
                }
            }
        })
    ]    
  )

  const connectors: (MetaMaskConnector | WalletConnectConnector | CoinbaseWalletConnector)[] = [
      new MetaMaskConnector({
          chains,
      }),
      new WalletConnectConnector({
          chains,
          options: {
              qrcode: true
          }
      }),
      new CoinbaseWalletConnector({
        chains,
        options: {
            appName,
        }
  })]

  const clientbuilt = createClient({
      autoConnect,
      connectors,
      provider,
  })

  return clientbuilt
}

/**
 * This component is a layer of [Wagmi](https://wagmi.sh/docs/getting-started) and [ConnectKit](https://docs.family.co/connectkit)
 * which allow to handle Metamask, WalletConnect and Coinbase without needing to set any config 
 */
export interface WalletProviderState {
/** All the wagmi client functionalities
 * @see [wagmi](https://wagmi.sh/docs/getting-started)
 */
client: Client
/** Metamask provider for example web3 or ethers */
getProvider: () => Provider;
/** Get all the connectors available */
getConnectors: () => Connector<any, any, any>[] //eslint-disable-line
/** Logout from the wallet */
logout: () => void;
/** Get the status of the wallet */
getStatus: () => "connecting" | "connected" | "reconnecting" | "disconnected" | undefined;
/** Get all the available chains */
getAllAvailableChains: () => Chain[];
/** The address of the wallet account */
walletAddress: string;
/** Login in Provider */
login: (connector: Connector<any, any, any>) => void; // eslint-disable-line
/** If chain is between the available networks supported */
checkIsChainCorrect: () => boolean;
}

export const WalletContext = createContext({} as WalletProviderState)

export const ClientComp = ({
    children,
    client,
    correctNetworkId,
    connectKitProps
  }: {
    children: React.ReactElement
    client: Client<any>, // eslint-disable-line
    correctNetworkId?: number
    connectKitProps?: ConnectKitProviderProps
  }) => {
  const [walletAddress, setWalletAddress] = useState<string>('')
  const { address, status } = useAccount()
  const { connect, connectors } = useConnect({
    onError(error) {
        console.error(`Error connect: ${error}`)
    },
    onSuccess(data) {
        console.log(`Wallet is connected: ${data}`)
    }
  })
  const { disconnect } = useDisconnect({
    onError(error) {
        console.error(`Error disconnect: ${error}`)
    },
    onSuccess() {
        console.log(`Wallet is disconnected`)
    }
  })
  const { switchNetwork } = useSwitchNetwork({
    onError(error) {
        console.error(`Error switch network: ${error}`)
    },
    onSuccess(data) {
        console.log(`New network is selected: ${data.name}`)
    }
  })
  const { chain, chains } = useNetwork()

  useEffect(() => {
      setWalletAddress(address || '')
  }, [address])

  useEffect(() => {
    if(chain?.unsupported && client.chains && switchNetwork) {
        switchNetwork(correctNetworkId || client.chains[0].id)
    }
}, [chain])

  //eslint-disable-next-line
  const login = (connector: Connector<any, any, any>) => connect({connector})

  const logout = () => disconnect()

  const getConnectors = () => connectors

  const getProvider = (bust?: boolean, chainId?: number) => client?.getProvider({bust, chainId})

  const getStatus = () => status

  const checkIsChainCorrect = () => !chain?.unsupported

  const getAllAvailableChains =  () => chains

  return ( 
    <ConnectKitProvider {...connectKitProps}>             
        <WalletContext.Provider value={{
            client,
            walletAddress,
            login,
            getConnectors,
            logout,
            getProvider,
            getStatus,
            checkIsChainCorrect,
            getAllAvailableChains,
        }}>
            {children}
        </WalletContext.Provider>
    </ConnectKitProvider>
  )
}

export const useWallet = (): WalletProviderState => {
  const contextValue = useContext(WalletContext)

  if (!contextValue) {
    throw new Error(
      'could not find MetaMask context value; please ensure the component is wrapped in a <WalletProvider>'
    )
  }

  return contextValue
}