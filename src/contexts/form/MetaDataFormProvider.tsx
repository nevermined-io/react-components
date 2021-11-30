import React from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

interface MetaDataFormProviderProps {
  children?: React.ReactNode;
}

export interface MetaDataFormDTO {
  name?: string;
  type?: 'dataset' | 'algorithm' | 'compute' | 'workflow' | 'compute';
  dateCreated?: string;
  datePublished?: string;
  author?: string;
  license?: string;
  price?: string;
  files?: File[];
  encryptedService?: any;
  workflow?: any;
  algorithm?: any;
  service?: any;
  description?: string;
  copyrightHolder?: string;
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

  return <FormProvider {...formContextProps}>{children}</FormProvider>;
};

export default MetaDataFormProvider;
export { useFormContext };
