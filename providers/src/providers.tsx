import React from "react"
import { Client, WagmiConfig } from "wagmi"
import { ClientComp } from './client'

/** 
 * This component is a layer of [Wagmi](https://wagmi.sh/docs/getting-started) and [ConnectKit](https://docs.family.co/connectkit)
 * which allow to handle Metamask, WalletConnect and Coinbase without needing to set any config 
 * 
 * @param config
 * @param config.client The wagmi client object @see [wagmi](https://wagmi.sh/docs/getting-started)
 * @param config.correctNetworkId Id of the default blockchain network in Hexadecimal. Default the fist chain configured
 * @returns All the functionalities to handle the wallet in dapp
 * 
 * @example
 * Start wallet provider example:
 * 
 * ```tsx
 * import React from 'react';
 * import ReactDOM from 'react-dom';
 * import { Catalog } from '@nevermined-io/catalog-core';
 * import { appConfig } from './config';
 * import Example from 'examples';
 * import { WalletProvider, getClient } from '@nevermined-io/catalog-providers';
 * import chainConfig from './chain_config';
 * 
 * 
 * ReactDOM.render(
 *   <div>
 *     <Catalog.NeverminedProvider config={appConfig} verbose={true}>
 *       <WalletProvider
 *         client={getClient(chainConfig)}
 *       >
 *         <Example />
 *       </WalletProvider>
 *     </Catalog.NeverminedProvider>
 *   </div>,
 *   document.getElementById('root') as HTMLElement
 * );
 * ```
 */
export const WalletProvider = ({
  children,
  client,
  correctNetworkId,
}: {
  children: React.ReactElement,
  client: Client<any>, // eslint-disable-line
  correctNetworkId?: number
}) => {
  // eslint-disable-next-line

  return (
      <>
          {client?.status ?
              <WagmiConfig client={client}>
                  <ClientComp client={client} correctNetworkId={correctNetworkId}>
                      {children}
                  </ClientComp>
              </WagmiConfig> 
              : <></>          
          }
      </>
  )
}