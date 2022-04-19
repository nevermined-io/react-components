import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './scss/style.scss';
import NeverminedProvider from 'lib/contexts/NeverminedProvider';
import generalConfig from './config';
import MetaDataFormProvider from 'lib/contexts/MetaDataFormProvider';

// const mnemonic =
//   process.env.REACT_APP_BURNER_MNEMONIC ||
//   'taxi music thumb unique chat sand crew more leg another off lamp';

// localStorage.setItem('seedphrase', mnemonic);

ReactDOM.render(
  <NeverminedProvider config={generalConfig.neverminedConfig}>
      <MetaDataFormProvider>
        <App />
      </MetaDataFormProvider>
  </NeverminedProvider>,

  document.getElementById('root') as HTMLElement
);
