// TODO: add MUI? https://blog.logrocket.com/using-material-ui-with-react-hook-form/

import React from 'react';
import { useFormContext } from '../../contexts/forms/MetaDataFormProvider';
import { FormFieldData } from './types';

import FileUpload from './FileUpload';

export interface FormFieldProps extends FormFieldData {
  className?: string;
}

const FormField = ({
  label,
  type,
  rows,
  cols,
  className = type,
  id,
  min,
  max,
  step
}: FormFieldProps) => {
  const { register } = useFormContext();

  const labelClassName = `${className}-label`; // b('label');
  const elementClassName = `${className}-${type}`;
  if (type === 'textarea')
    return (
      <li className={className}>
        <label className={labelClassName} htmlFor={id}>
          {label}
        </label>
        <textarea
          className={elementClassName}
          {...register(id)}
          id={id}
          rows={rows || 4}
          cols={cols || 4}
        />
      </li>
    );

  if (type === 'text') {
    return (
      <li className={className}>
        <label className={labelClassName} htmlFor={id}>
          {label}
        </label>
        <input className={elementClassName} {...register(id)} type={type} id={id} />
      </li>
    );
  }

  if (type === 'number') {
    return (
      <li className={className}>
        <label className={labelClassName} htmlFor={id}>
          {label}
        </label>
        <input
          className={elementClassName}
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
      </li>
    );
  }

  if (type === 'checkbox') {
    return (
      <li className={className}>
        <label className={labelClassName} htmlFor={id}>
          {label}
        </label>
        <input className={elementClassName} {...register(id)} type={type} id={id} />
      </li>
    );
  }

  if (type === 'radio') {
    return (
      <li className={className}>
        <label className={labelClassName} htmlFor={id}>
          {label}
        </label>
        <input className={elementClassName} {...register} type={type} id={id} />
      </li>
    );
  }

  if (type === 'file') {
    return (
      <li className={className} role="button" aria-label="File Upload">
        <label className={labelClassName} htmlFor={id}>
          {label}
        </label>
        <FileUpload
          className={className}
          labelClassName={labelClassName}
          elementClassName={elementClassName}
          previewClassName={`${elementClassName}preview`}
          id={id}
          label={label}
          type={type}
        />
      </li>
    );
  }
  return <div />;
};

export default FormField;
