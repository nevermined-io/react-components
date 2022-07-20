import React from 'react';
import ReactDOM from 'react-dom';
import Catalog from 'hello-catalog';
import { appConfig } from './config';
import Example from 'examples';
<<<<<<< HEAD
||||||| parent of a2a1340 (test new providers package)
import NVMWallets from 'catalog-providers';
=======
import Providers from 'catalog-providers';
>>>>>>> a2a1340 (test new providers package)

ReactDOM.render(
  <div>
    <Catalog.NeverminedProvider config={appConfig} verbose={true}>
<<<<<<< HEAD
      <Example />
||||||| parent of a2a1340 (test new providers package)
      <NVMWallets.MetaMask.WalletProvider
        chainConfig={chainConfig}
        correctNetworkId={mumbaiChainId}
        nodeUri={String(appConfig.nodeUri)}
      >
        <Example />
      </NVMWallets.MetaMask.WalletProvider>
=======
      <Providers.MetaMask.WalletProvider
        chainConfig={chainConfig}
        correctNetworkId={mumbaiChainId}
        nodeUri={String(appConfig.nodeUri)}
      >
        <Example />
      </Providers.MetaMask.WalletProvider>
>>>>>>> a2a1340 (test new providers package)
    </Catalog.NeverminedProvider>
  </div>,
  document.getElementById('root') as HTMLElement
);
