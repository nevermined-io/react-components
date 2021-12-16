import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

const mnemonic =
  process.env.REACT_APP_BURNER_MNEMONIC ||
  'taxi music thumb unique chat sand crew more leg another off lamp';

localStorage.setItem('seedphrase', mnemonic);

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
