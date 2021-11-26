import React from 'react';
import { FormInformation } from '../../types';

import defaultStyles from './scss/RegistrationStep.module.scss';
import FormField from './FormField';

interface RegistrationStepProps {
  title: string | React.ReactNode;
  styles?: {
    root?: any;
    form?: any;
    formElement?: any;
  };
  fields: Array<FormInformation>;
}

const RegistrationStep = ({
  title = 'Registration Step',
  styles = defaultStyles,
  fields = [
    {
      label: 'Author',
      id: 'author',
      type: 'text'
    }
  ]
}: RegistrationStepProps) => {
  return (
    <section className={styles.root}>
      {typeof title === 'string' ? <h2>{title}</h2> : title}
      <form className={styles.form}>
        {fields.map(({ id, label, type, rows, cols, min, max, step }: FormInformation) => {
          return (
            <FormField
              className={styles.formElement}
              label={label}
              rows={rows}
              cols={cols}
              key={id}
              id={id}
              min={min}
              max={max}
              step={step}
              type={type}
            />
          );
        })}
      </form>
    </section>
  );
};

export default RegistrationStep;
