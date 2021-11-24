import React, { useState } from 'react';
import Authorship from './Authorship';
import Details from './Details';
import Pricing from './Pricing';
import { useForm } from 'react-hook-form';

import defaultStyles from './index.module.scss';
import { FormInformation } from '../../types';
import RegistrationStep from './RegistrationStep';

interface AssetRegistrationProps {
  styles?: {
    root?: string;
    navigationButtonContainer?: string;
  };
  debug?: boolean;
  onSubmit?: (data: any) => void;
  onSubmitError?: (error: any) => void;
  detailsFields?: Array<FormInformation>;
  pricingFields?: Array<FormInformation>;
  authorshipFields?: Array<FormInformation>;
}

export default function AssetRegistration({
  debug = true,
  onSubmit = (data: any) => console.log('Should submit to API', data),
  onSubmitError = (error: any) => console.log('Error', error),
  styles = defaultStyles
}: AssetRegistrationProps) {
  const { register, watch, handleSubmit } = useForm<FormData>();
  const [currentStep, setCurrentStep] = useState(0);

  if (debug) console.log(watch());

  const onNextClick = () => setCurrentStep(currentStep + 1);
  const onPreviousClick = () => setCurrentStep(currentStep - 1);

  return (
    <div className={styles.root}>
      <h1>Asset Registration, Current Step: {currentStep}</h1>

      {currentStep === 0 && <RegistrationStep title={<h2>Details</h2>} register={register} />}
      {currentStep === 1 && <RegistrationStep title={<h2>Authorship</h2>} register={register} />}
      {currentStep === 2 && <RegistrationStep title={<h2>Pricing</h2>} register={register} />}

      <div className={styles.navigationButtonContainer}>
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
      </div>
    </div>
  );
}
