import React from 'react';
import ReactDOM from 'react-dom';
import Catalog from '@nevermined-io/catalog-core';
import { appConfig } from './config';
import Example from 'examples';
import Providers from '@nevermined-io/catalog-providers';
import chainConfig, { mumbaiChainId } from './chain_config';

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
