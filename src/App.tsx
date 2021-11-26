import React from 'react';
import './scss/style.scss';
import AssetRegistration from './components/AssetRegistration';
import mapFormDataToMetaData, { MetaDataFormDTO } from './utils/mapFormDataToMetaData';
import { postMetaData, getMetaData } from './hooks/publishMetaData';
import { DDO, DID, MetaData } from '@nevermined-io/nevermined-sdk-js';
import Previews from './components/Utilities/TestDropzone';

function App() {
  const onSubmit = async (data: MetaDataFormDTO) => {
    console.log('onSubmityes', data);
    const dataToSend = mapFormDataToMetaData('jochenname', data);
    console.log('mappedData', dataToSend);

    try {
      const res: DDO = await postMetaData(dataToSend);
      console.log(res);
      const res2 = await getMetaData(res.id);
      console.log('res2', res2);
    } catch (e) {
      console.error('appsubmiterr', e);
    }
  };
  const onSubmitError = (data: any) => console.log('onSubmitError', data);

  return (
    <div className="App">
      {/* <Previews /> */}
      <AssetRegistration
        onSubmit={onSubmit}
        onSubmitError={onSubmitError}
        detailFields={[
          { id: 'name', label: 'Asset Name', type: 'text' },
          { id: 'description', label: 'Asset Description:', type: 'textarea' },
          { id: 'huso', label: 'wers ein huso:', type: 'textarea' }
          //   { id: 'lifeLost', label: 'so viel geld?', type: 'file', min: 4, max: 20, step: 2 }
        ]}
      />
    </div>
  );
}

export default App;
