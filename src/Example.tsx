import React, { useEffect } from 'react';
import './scss/style.scss';
import mapFormDataToMetaData from './utils/mapFormDataToMetaData';
import { postMetaData, getMetaData } from './hooks/publishMetaData';
import { DDO } from '@nevermined-io/nevermined-sdk-js';
import FormField, { FormFieldProps } from './components/AssetRegistration/FormField';
import { useFormContext, MetaDataFormDTO } from './contexts/forms/MetaDataFormProvider';
import { useNevermined } from './contexts/NeverminedProvider';
import AssetRegistration from './components/AssetRegistration';
import { useAssetRegistration } from './contexts/AssetRegistrationProvider';

function Example() {
  const { registerAsset } = useAssetRegistration();

  const onSubmit = async (data: MetaDataFormDTO) => {
    console.log('onSubmityes', data);
    const dataToSend = mapFormDataToMetaData('jochenname', data);
    console.log('mappedData', dataToSend);

    try {
      const res: DDO = await registerAsset(mapFormDataToMetaData('jochenname', data));
      console.log(res);
      const res2 = await getMetaData(res.id);
      console.log('res2', res2);
    } catch (e) {
      console.error('appsubmiterr', e);
    }
  };

  const onSubmitError = (data: any) => console.log('onSubmitError', data);

  const result = useNevermined();
  useEffect(() => {
    const login = async () => {
      await result.connect();
      console.log('login result ye', result, result.balance);
    };
    login();
  }, []);

  const fields: FormFieldProps[] = [
    { id: 'name', label: 'Asset Name', type: 'text' },
    { id: 'description', label: 'Asset Description:', type: 'textarea' },
    { id: 'testing', label: 'One thing:', type: 'textarea' },
    { id: 'something', label: 'Something:', type: 'textarea' }
  ];

  return (
    <>
      {/* {isLoggedIn && (
        <form className={formClassName}>
          {fields.map((field: FormFieldProps) => (
            <FormField className={formClassName + ' ' + field.type} key={field.id} {...field} />
          ))}
        </form>
      )}
      */}

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
