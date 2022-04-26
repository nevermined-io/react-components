import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Catalog from 'hello-catalog';
import generalConfig from './config';
import App from 'App';

const Childs = () => {
  const state = Catalog.useNevermined();
  return <div> hello </div>;
};

ReactDOM.render(
  <div>
    <Catalog.NeverminedProvider config={generalConfig}>
      <Childs />
      <App />
    </Catalog.NeverminedProvider>
  </div>,
  document.getElementById('root') as HTMLElement
);
