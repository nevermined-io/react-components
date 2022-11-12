import React, {
    useState,
    useEffect,
} from "react"
import { createClient, configureChains, Client, Chain, WagmiConfig } from "wagmi"
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import DefaultChainConfig from "./chain-config"
import { ClientComp } from './client'

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

    return (
        <>
            {client?.status ?
                <WagmiConfig client={client}>
                    <ClientComp client={client} correctNetworkId={correctNetworkId} chainsConfig={chainsConfig}>
                        {children}
                    </ClientComp>
                </WagmiConfig> 
                : <></>          
            }
        </>
    )
}
