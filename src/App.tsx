import React from 'react';
import './scss/style.scss';
import AssetRegistration from './components/AssetRegistration';
import mapFormDataToMetaData, { MetaDataFormDTO } from './utils/mapFormDataToMetaData';
import { postMetaData, getMetaData } from './hooks/publishMetaData';
import { DDO } from '@nevermined-io/nevermined-sdk-js';

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
          { id: 'testing', label: 'wers ein test:', type: 'textarea' }
        ]}
      />
    </div>
  );
}

export default App;
