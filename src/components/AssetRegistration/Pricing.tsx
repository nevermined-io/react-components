import React from 'react';
import { useForm, UseFormRegister } from 'react-hook-form';

import { FormInformation } from '../../types';
import FormField from './FormField';
import defaultStyles from './scss/Pricing.module.scss';
type MData = {
  name: string;
  type: 'dataset' | 'algorithm' | 'compute' | 'workflow' | 'compute';
  dateCreated: string;
  datePublished?: string;
  author: string;
  license: string;
  price: string;
  files?: File[];
  encryptedService?: any;
  workflow?: any;
  algorithm?: any;
  service?: any;
};

interface PricingProps {
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
  //   author: ''
  //   dateCreated: new Date().toISOString(),
  //   datePublished: '',
  //   author: '',
  //   license: '',
  price: ''
  //   files: []
};

const Pricing = ({
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
}: PricingProps) => {
  return (
    <div>
      <h2>Pricing</h2>
      <form className={styles.form}>
        {fields.map(({ value: key, label, type, rows, cols }: FormInformation) => {
          return (
            <FormField
              label={label}
              rows={rows}
              cols={cols}
              key={key}
              id={key}
              type={type}
              className={styles.formElement}
              value={key}
              register={register(key as keyof MData)}
            />
          );
        })}
      </form>
    </div>
  );
};

export default Pricing;
