import React from 'react';
import './scss/style.scss';
import AssetRegistration from './components/AssetRegistration';
import mapFormDataToMetaData, { MetaDataFormDTO } from './utils/mapFormDataToMetaData';
import { postMetaData } from './hooks/publishMetaData';
import { MetaData } from '@nevermined-io/nevermined-sdk-js';

function App() {
  const onSubmit = async (data: MetaDataFormDTO) => {
    console.log('onSubmityes', data);
    const dataToSend = mapFormDataToMetaData('customData', data);
    console.log('mappedData', dataToSend);

    try {
      //   const res = await postMetaData(dataToSend);
      //   console.log(res);
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <div className="App">
      <AssetRegistration onSubmit={onSubmit} />
    </div>
  );
}

export default App;
