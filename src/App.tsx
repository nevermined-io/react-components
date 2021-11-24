import React from 'react';
import './scss/style.scss';
import AssetRegistration from './components/AssetRegistration';
import mapFormDataToMetaData, { MetaDataFormDTO } from './utils/mapFormDataToMetaData';

function App() {
  const onSubmit = (data: MetaDataFormDTO) => {
    console.log('onSubmityes', data);
    const dataToSend = mapFormDataToMetaData('customData', data);
    console.log('mappedData', dataToSend);
  };
  return (
    <div className="App">
      <AssetRegistration onSubmit={onSubmit} />
    </div>
  );
}

export default App;
