import React from 'react';
import './scss/style.scss';
import MetaDataFormProvider from './contexts/forms/MetaDataFormProvider';
import Example from './Example';
import NeverminedProvider from './contexts/NeverminedProvider';
import AssetRegistrationProvider from './contexts/AssetRegistrationProvider';

function App() {
  return (
    <div className="App">
      <NeverminedProvider>
        <AssetRegistrationProvider>
          <MetaDataFormProvider>
            <Example />
          </MetaDataFormProvider>
        </AssetRegistrationProvider>
      </NeverminedProvider>
    </div>
  );
}

export default App;
