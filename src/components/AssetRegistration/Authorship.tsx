import React from 'react';

import { UseFormRegister } from 'react-hook-form';
import { FormInformation } from '../../types';

import defaultStyles from './scss/Authorship.module.scss';
import FormField from './FormField';
import { MetaDataFormDTO } from '../../utils/mapFormDataToMetaData';

interface AuthorshipProps {
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

const Authorship = ({
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
}: AuthorshipProps) => {
  return (
    <div>
      <h2>Authorship</h2>
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
              register={register(key as keyof MetaDataFormDTO)}
            />
          );
        })}
      </form>
    </div>
  );
};

export default Authorship;
