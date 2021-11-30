// TODO: add MUI? https://blog.logrocket.com/using-material-ui-with-react-hook-form/

import React, { useEffect } from 'react';
import { FormInformation } from '../../types';

import FileUpload from './FileUpload';

import { useFormContext } from '../../contexts/form/MetaDataFormProvider';
import { MetaDataFormDTO } from '../../contexts/form/MetaDataFormProvider';

export interface FormFieldProps extends FormInformation {
  id: string | keyof MetaDataFormDTO;
  className?: string;
}

const FormField = ({ label, type, rows, cols, className, id, min, max, step }: FormFieldProps) => {
  const { register } = useFormContext();

  if (type === 'textarea')
    return (
      <div className={className}>
        <label htmlFor={id}>{label}</label>
        <textarea {...register(id)} id={id} rows={rows || 4} cols={cols || 4} />
      </div>
    );

  if (type === 'text') {
    return (
      <div className={className}>
        <label htmlFor={id}>{label}</label>
        <input {...register(id)} type={type} id={id} />
      </div>
    );
  }

  if (type === 'number') {
    return (
      <div className={className}>
        <label htmlFor={id}>{label}</label>
        <input
          {...register(id, {
            min,
            max
          })}
          type={type}
          id={id}
          min={min}
          max={max}
          step={step}
        />
      </div>
    );
  }

  if (type === 'checkbox') {
    return (
      <div className={className}>
        <label htmlFor={id}>{label}</label>
        <input {...register(id)} type={type} id={id} />
      </div>
    );
  }

  if (type === 'radio') {
    return (
      <div className={className}>
        <label htmlFor={id}>{label}</label>
        <input {...register} type={type} id={id} />
      </div>
    );
  }

  if (type === 'file') {
    return <FileUpload className={className} id={id} label={label} type={type} />;
  }
  return <div />;
};

export default FormField;
