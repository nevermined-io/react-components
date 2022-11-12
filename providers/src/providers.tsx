import React, {
    useState,
    createContext,
    useEffect,
    useContext,
} from "react"
import { WagmiConfig, createClient, configureChains, Client, Chain, useAccount, useNetwork, useSwitchNetwork } from "wagmi"
import type { ConnectorData } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { ConnectKitProvider } from 'connectkit'
import DefaultChainConfig from "./chain-config"
import { Provider } from "@ethersproject/abstract-provider"
  
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
    /** Logout from the wallet */
    logout: () => void;
    /** Get the status of the wallet */
    getStatus: () => "connecting" | "connected" | "reconnecting" | "disconnected" | undefined;
    /** Get all the available chains */
    getAllAvailableChains: () => Chain[];
    /** The address of the wallet account */
    walletAddress: string;
    /** Login in Provider */
    login: () => Promise<Required<ConnectorData<any>>> | undefined; // eslint-disable-line
    /** If chain is between the available networks supported */
    checkIsChainCorrect: () => boolean;
}

export const WalletContext = createContext({} as WalletProviderState)

/**
 * Wallet provider for Metamask, WalletConnect and Coinbase with all the functionalities to handle the wallet in dapp 
 * @param config
 * @param config.correctNetworkId Id of the default blockchain network in Hexadecimal. Default the fist chain configured
 * @param config.autoConnect If it is true once that the dapp start to run it will try to connect to the wallet automatically. Default `true`
 * @param config.externalChainConfig Config with all the available chains that can be used in the dapp. Default chains supported `Polygon Mainnet`, `Polygon Mumbai`, `spree (localhost)`
 * @param config.appName App name required for Coinbase wallet. If appName is undefined Coinbase wallet won't be supported 
 * @returns All the functionalities to handle the wallet in dapp
 * 
 * @example
 * Start Metamask provider example:
 * 
 * ```tsx
 * import React from 'react';
 * import ReactDOM from 'react-dom';
 * import Catalog from '@nevermined-io/catalog-core';
 * import { appConfig } from './config';
 * import Example from 'examples';
 * import { MetaMask } from '@nevermined-io/catalog-providers';
 * import chainConfig, { mumbaiChainId } from './chain_config';
 * 
 * 
 * ReactDOM.render(
 *   <div>
 *     <Catalog.NeverminedProvider config={appConfig} verbose={true}>
 *       <MetaMask.WalletProvider
 *         externalChainConfig={chainConfig}
 *       >
 *         <Example />
 *       </MetaMask.WalletProvider>
 *     </Catalog.NeverminedProvider>
 *   </div>,
 *   document.getElementById('root') as HTMLElement
 * );
 * ```
 */
export const WalletProvider = ({
    children,
    correctNetworkId,
    autoConnect,
    externalChainConfig,
    appName,
}: {
    children: React.ReactElement
    correctNetworkId?: number
    autoConnect?: boolean
    externalChainConfig?: Chain[]
    appName?: string
}) => {
    // eslint-disable-next-line
    const [client, setClient] = useState<Client<any>>()
    const [walletAddress, setWalletAddress] = useState<string>('')
    const { address, status } = useAccount()
    const { chain, chains } = useNetwork()
    const { switchNetwork } = useSwitchNetwork()
    const chainsConfig = DefaultChainConfig || externalChainConfig

    useEffect(() => {
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
        ]

        if(appName) {
            connectors.push(new CoinbaseWalletConnector({
                chains,
                options: {
                    appName,
                }
            }))
        }

        const clientbuilt = createClient({
            autoConnect: autoConnect === undefined ? true : autoConnect,
            connectors,
            provider,
        })
        
        setClient(clientbuilt)
        
    }, [])

    useEffect(() => {
        if(chain?.unsupported && switchNetwork) {
            switchNetwork(correctNetworkId || chainsConfig[0].id)
        }
    }, [chain])

    useEffect(() => {
        setWalletAddress(address || '')
    }, [address])

    const login = (config?: {chainId: number}) => client?.connector?.connect(config)

    const logout = () => client?.connector?.disconnect()

    const getProvider = (bust?: boolean, chainId?: number) => client?.getProvider({bust, chainId})

    const getStatus = () => status

    const checkIsChainCorrect = () => !chain?.unsupported

    const getAllAvailableChains =  () => chains

    return (
        <>
            {client?.status ? <WagmiConfig client={client}>
                <ConnectKitProvider>                
                    <WalletContext.Provider value={{
                        client,
                        walletAddress,
                        login,
                        logout,
                        getProvider,
                        getStatus,
                        checkIsChainCorrect,
                        getAllAvailableChains,
                    }}>
                        {children}
                    </WalletContext.Provider>
                </ConnectKitProvider>
            </WagmiConfig> : <></>}
        </>
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
