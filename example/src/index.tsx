import React from 'react';
import ReactDOM from 'react-dom';
import Catalog from '@nevermined-io/compnents-catalog';
import { appConfig } from './config';
import Example from 'examples';
import NVMWallets from '@nevermined-io/providers-catalog';
import chainConfig, { mumbaiChainId } from './chain_config';
import Providers from 'catalog-providers';

ReactDOM.render(
  <div>
    <Catalog.NeverminedProvider config={appConfig} verbose={true}>
      <Example />
      <Providers.MetaMask.WalletProvider
        chainConfig={chainConfig}
        correctNetworkId={mumbaiChainId}
        nodeUri={String(appConfig.nodeUri)}
      >
        <Example />
      </Providers.MetaMask.WalletProvider>
    </Catalog.NeverminedProvider>
  </div>,
  document.getElementById('root') as HTMLElement
);
