import React from 'react';
import './scss/style.scss';
import MetaDataFormProvider from './contexts/form/MetaDataFormProvider';
import Example from './Example';

function App() {
  return (
    <div className="App">
      <MetaDataFormProvider>
        <Example />
      </MetaDataFormProvider>
    </div>
  );
}

export default App;

{
  /* <Previews /> */
}
{
  /* <AssetRegistration
        onSubmit={onSubmit}
        onSubmitError={onSubmitError}
        detailFields={[
          { id: 'name', label: 'Asset Name', type: 'text' },
          { id: 'description', label: 'Asset Description:', type: 'textarea' },
          { id: 'testing', label: 'One thing:', type: 'textarea' },
          { id: 'something', label: 'Something:', type: 'textarea' }
        ]}
        authorshipFields={[
          { id: 'onething', label: 'One thing:', type: 'textarea' },
          { id: 'someimage', label: 'Some image:', type: 'file', mimeType: 'image/*' }
        ]}
        pricingFields={[{ id: 'anotherthing', label: 'Another thing:', type: 'textarea' }]}
      /> */
}
