import React from 'react';
import './scss/style.scss';
import MetaDataFormProvider from './contexts/form/MetaDataFormProvider';
import Example from './Example';
import NeverminedProvider from './contexts/NeverminedProvider';

function App() {
  return (
    <div className="App">
      <NeverminedProvider>
        <MetaDataFormProvider>
          <Example />
        </MetaDataFormProvider>
      </NeverminedProvider>
    </div>
  );
}

export default App;
