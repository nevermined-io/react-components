import React from 'react';
import ReactDOM from 'react-dom';
import Catalog from '@nevermined-io/components-catalog';
import { appConfig } from './config';
import Example from 'examples';

ReactDOM.render(
  <div>
    <Catalog.NeverminedProvider config={appConfig} verbose={true}>
      <Example />
    </Catalog.NeverminedProvider>
  </div>,
  document.getElementById('root') as HTMLElement
);
