import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import defaultStyles from './scss/index.module.scss';
import RegistrationStep from './RegistrationStep';
import { FormFieldData } from './types';

import uniqBy from 'lodash.uniqby';
import { BEM } from '../../utils/bemHelpers';
// import MetaDataFormProvider, { MetaDataFormDTO } from '../../contexts/form/MetaDataFormProvider';

interface AssetRegistrationProps {
  styles?: {
    root?: string;
    navigationButtonContainer?: string;
    registrationStep?: string;
  };
  className?: string;
  debug?: boolean;
  onSubmit?: (data: any) => void;
  onSubmitError?: (error: any) => void;
  detailFields?: Array<FormFieldData>;
  authorshipFields?: Array<FormFieldData>;
  pricingFields?: Array<FormFieldData>;
}

export default function AssetRegistration({
  debug = false,
  onSubmit = (data: any) => console.log('Should submit to API', data),
  onSubmitError = (error: any) => console.log('Error', error),
  styles = defaultStyles,
  className = 'asset-registration',
  detailFields = [],
  pricingFields = [],
  authorshipFields = []
}: AssetRegistrationProps) {
  const { watch, handleSubmit } = useFormContext();
  const [currentStep, setCurrentStep] = useState(0);

  const b = BEM(className);

  // * logging input values
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (debug) console.log(value, name);
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const onNextClick = () => setCurrentStep(currentStep + 1);
  const onPreviousClick = () => setCurrentStep(currentStep - 1);

  return (
    <section className={className}>
      <h1>{`Asset Registration, Current Step: ${currentStep}`}</h1>

      {currentStep === 0 && (
        <RegistrationStep
          className={'registration-step'}
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
          className={'registration-step'}
          title={<h2>Authorship</h2>}
          fields={uniqBy(
            [{ id: 'author', label: 'Asset Author', type: 'text' }, ...authorshipFields],
            'id'
          )}
        />
      )}
      {currentStep === 2 && (
        <RegistrationStep
          className={'registration-step'}
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

      <section className={b('button-container')}>
        {currentStep !== 0 && (
          <button
            className={b('button-secondary')}
            disabled={currentStep === 0}
            onClick={onPreviousClick}
            type="button"
            name="previous"
            data-qa="previous-button"
          >
            Previous
          </button>
        )}
        {currentStep < 2 && (
          <button
            className={b('button-secondary')}
            disabled={currentStep === 2}
            onClick={onNextClick}
            type="button"
            name="next"
            data-qa="next-button"
          >
            Next
          </button>
        )}
        {currentStep === 2 && (
          <button
            className={b('button-primary')}
            onClick={handleSubmit(onSubmit, onSubmitError)}
            type="submit"
            name="submit"
            data-qa="submit-button"
          >
            Submit
          </button>
        )}
      </section>
    </section>
  );
}
