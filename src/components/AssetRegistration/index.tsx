import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import defaultStyles from './scss/index.module.scss';
import { FormInformation } from '../../types';
import RegistrationStep from './RegistrationStep';
import { MetaDataFormDTO } from '../../utils/mapFormDataToMetaData';
import uniqBy from 'lodash.uniqby';

interface AssetRegistrationProps {
  styles?: {
    root?: string;
    navigationButtonContainer?: string;
    registrationStep?: string;
  };
  debug?: boolean;
  onSubmit?: (data: any) => void;
  onSubmitError?: (error: any) => void;
  detailFields?: Array<FormInformation>;
  authorshipFields?: Array<FormInformation>;
  pricingFields?: Array<FormInformation>;
}

export default function AssetRegistration({
  debug = true,
  onSubmit = (data: any) => console.log('Should submit to API', data),
  onSubmitError = (error: any) => console.log('Error', error),
  styles = defaultStyles,
  detailFields = [],
  pricingFields = [],
  authorshipFields = []
}: AssetRegistrationProps) {
    
  const formContextProps = useForm<MetaDataFormDTO>({
    mode: 'onBlur',
    // TODO: use MetaData type with this approach: https://gist.github.com/pjchender/e021d3b96fda374bace89c5713c0598d
    defaultValues: {
      author: '',
      name: '',
      price: '0',
      description: '',
      files: []
    }
  });
  const { watch, handleSubmit } = formContextProps;
  const [currentStep, setCurrentStep] = useState(0);

  if (debug) console.log(watch());

  const onNextClick = () => setCurrentStep(currentStep + 1);
  const onPreviousClick = () => setCurrentStep(currentStep - 1);

  return (
    <FormProvider {...formContextProps}>
      <section className={styles.root}>
        <h1>Asset Registration, Current Step: {currentStep}</h1>

        {currentStep === 0 && (
          <RegistrationStep
            title={<h2>Details</h2>}
            fields={uniqBy(
              [
                { id: 'name', label: 'Asset Name', type: 'text' },
                { id: 'description', label: 'Asset Description:', type: 'textarea' },
                { id: 'files', label: 'Asset Files:', type: 'file' },
                ...detailFields
              ],
              'id'
            )}
          />
        )}
        {currentStep === 1 && (
          <RegistrationStep
            // styles={styles.registrationStep}
            title={<h2>Authorship</h2>}
            fields={uniqBy(
              [{ id: 'author', label: 'Asset Author', type: 'text' }, ...authorshipFields],
              'id'
            )}
          />
        )}
        {currentStep === 2 && (
          <RegistrationStep
            title={<h2>Pricing</h2>}
            fields={uniqBy(
              [
                {
                  id: 'price',
                  label: 'Asset Price',
                  type: 'number',
                  min: 0,
                  step: 1
                },
                ...pricingFields
              ],
              'id'
            )}
          />
        )}

        <section className={styles.navigationButtonContainer}>
          {currentStep !== 0 && (
            <button disabled={currentStep === 0} onClick={onPreviousClick} type="button">
              Previous
            </button>
          )}
          {currentStep < 2 && (
            <button disabled={currentStep === 2} onClick={onNextClick} type="button">
              Next
            </button>
          )}
          {currentStep === 2 && (
            <button onClick={handleSubmit(onSubmit, onSubmitError)} type="button">
              Submit
            </button>
          )}
        </section>
      </section>
    </FormProvider>
  );
}
