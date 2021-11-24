import React from 'react';

import { UseFormRegister } from 'react-hook-form';
import { FormInformation } from '../../types';

import defaultStyles from './scss/Authorship.module.scss';
import FormField from './FormField';
import { MetaDataFormDTO } from '../../utils/mapFormDataToMetaData';

interface RegistrationStepProps {
  title: string | React.ReactNode;
  register: UseFormRegister<any>;
  styles?: {
    root?: any;
    form?: any;
    formElement?: any;
  };
  fields?: Array<FormInformation>;
  data?: any;
  onSubmit?: (data: any) => void;
  onSubmitError?: (error: any) => void;
}

const main: any = {
  author: ''
  //   dateCreated: new Date().toISOString(),
  //   datePublished: '',
  //   author: '',
  //   license: '',
  //   price: ''
  //   files: []
};

const RegistrationStep = ({
  title = 'Registration Step',
  styles = defaultStyles,
  onSubmit = (data: any) => console.log('Should submit to API', data),
  onSubmitError = (error: any) => console.log('Error', error),
  data = main,
  fields = Object.keys(data).map((d: string) => ({
    label: d.toUpperCase(),
    value: d,
    type: d === 'description' ? 'textarea' : 'text'
  })),
  register
}: RegistrationStepProps) => {
  return (
    <div>
      {title}
      <form className={styles.form}>
        {fields.map(({ value: key, label, type, rows, cols, min, max, step }: FormInformation) => {
          return (
            <FormField
              label={label}
              rows={rows}
              cols={cols}
              key={key}
              id={key}
              min={min}
              max={max}
              step={step}
              type={type}
              className={styles.formElement}
              value={key}
              register={register(key as keyof MetaDataFormDTO, {
                min,
                max,
                valueAsNumber: type === 'number'
              })}
            />
          );
        })}
      </form>
    </div>
  );
};

export default RegistrationStep;
