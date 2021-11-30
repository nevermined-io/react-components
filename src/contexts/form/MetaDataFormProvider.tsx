import React from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { MetaDataFormDTO } from '../../utils/mapFormDataToMetaData';

interface MetaDataFormProviderProps {
  children?: React.ReactNode;
}

const MetaDataFormProvider = ({ children }: MetaDataFormProviderProps) => {
  const formContextProps = useForm<MetaDataFormDTO>({
    mode: 'onBlur',
    defaultValues: {
      author: '',
      name: '',
      price: '0',
      description: '',
      files: []
    }
  });
  const { watch, handleSubmit } = formContextProps;

  return <FormProvider {...formContextProps}>{children}</FormProvider>;
};

export default MetaDataFormProvider;
export { useFormContext };
