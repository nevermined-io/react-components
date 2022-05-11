import React from 'react';
import ReactDOM from 'react-dom';
import Catalog from 'hello-catalog';
import appConfig from './config';
import Example from 'examples';

ReactDOM.render(
  <div>
    <Catalog.NeverminedProvider config={appConfig}>
      <Example />
    </Catalog.NeverminedProvider>
  </div>,
  document.getElementById('root') as HTMLElement
);
