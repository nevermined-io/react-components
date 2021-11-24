import React from 'react';
import { FormInformation } from '../../types';
import { UseFormRegisterReturn } from 'react-hook-form';

export interface FormFieldProps extends FormInformation {
  id: string;
  register: UseFormRegisterReturn;
  className?: string;
}

const FormField = ({ label, type, rows, cols, className, register, id }: FormFieldProps) => {
  if (type === 'textarea')
    return (
      <div className={className}>
        <label htmlFor={id}>{label}</label>
        <textarea {...register} id={id} rows={rows || 4} cols={cols || 4} />
      </div>
    );

  if (type === 'text') {
    return (
      <div className={className}>
        <label htmlFor={id}>{label}</label>
        <input {...register} type={type} id={id} />
      </div>
    );
  }

  if (type === 'number') {
    return (
      <div className={className}>
        <label htmlFor={id}>{label}</label>
        <input {...register} type={type} id={id} />
      </div>
    );
  }

  return <div />;
};

export default FormField;
