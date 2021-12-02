import React, { useEffect } from 'react';
import './scss/style.scss';
import mapFormDataToMetaData from 'lib/utils/mapFormDataToMetaData';

import { DDO } from '@nevermined-io/nevermined-sdk-js';
import { MetaDataFormDTO } from 'lib/contexts/forms/MetaDataFormProvider';
import { useNevermined } from 'lib/contexts/NeverminedProvider';
import { AssetRegistration, FormFieldData } from 'lib/components/AssetRegistration';
import { useAssetRegistration } from 'lib/contexts/AssetRegistrationProvider';

function Example() {
  const { registerAsset, retrieveAssetDDO } = useAssetRegistration();

  const onSubmit = async (data: MetaDataFormDTO) => {
    console.log('onSubmityes', data);
    const dataToSend = mapFormDataToMetaData('jochenname', data);
    console.log('mappedData', dataToSend);

    try {
      const res: DDO = await registerAsset(mapFormDataToMetaData('jochenname', data));
      console.log(res);
      const res2: DDO = await retrieveAssetDDO(res.id);
      console.log('res2', res2);
    } catch (e) {
      console.error('appsubmiterr', e);
    }
  };

  const onSubmitError = (data: any) => console.log('onSubmitError', data);

  const nvmContext = useNevermined();
  useEffect(() => {
    const login = async () => {
      await nvmContext.connect();
      console.log('login nvmContext ye', nvmContext, nvmContext.user.balance);
    };
    login();
  }, [nvmContext]);

  const fields: FormFieldData[] = [
    { id: 'name', label: 'Asset Name', type: 'text' },
    { id: 'description', label: 'Asset Description:', type: 'textarea' },
    { id: 'testing', label: 'One thing:', type: 'textarea' },
    { id: 'something', label: 'Something:', type: 'textarea' }
  ];

  return (
    <>
      {/* {isLoggedIn && (
        <form className={formClassName}>
          {fields.map((field: FormFieldData) => (
            <FormField className={formClassName + ' ' + field.type} key={field.id} {...field} />
          ))}
        </form>
      )}
      */}
      {/* <div className="loader" /> */}
      <AssetRegistration
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
      />
      {/* {!isLoggedIn && <div>not logged in</div>} */}
      {/* <button onClick={handleSubmit(onSubmit, onSubmitError)} type="button">
        Submit
      </button> */}
    </>
  );
}

export default Example;
