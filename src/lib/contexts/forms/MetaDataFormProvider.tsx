import React, { createContext, useContext } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

/**
 * One-dimensional mapping of Nevermined MetaData to be used with thwe form.
 */
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

interface MetaDataFormProviderValue {}

/**
 * Props for the FormProvider.
 * You can set default values that match the @MetaDataFormDTO
 */
export interface MetaDataFormProviderProps {
  children?: React.ReactNode;
  defaultValues?: MetaDataFormDTO;
}

const MetaDataFormProvider = ({
  children,
  defaultValues = {
    author: '',
    name: '',
    price: '0',
    description: '',
    files: []
  }
}: MetaDataFormProviderProps) => {
  const formContextProps = useForm<MetaDataFormDTO>({
    mode: 'onBlur',
    defaultValues
  });

  return <FormProvider {...formContextProps}>{children}</FormProvider>;
};

const MetaDataFormContext = createContext({} as MetaDataFormProviderValue);

// Helper hook to access the provider values
const useMetaDataForm = (): MetaDataFormProviderValue => useContext(MetaDataFormContext);

export default MetaDataFormProvider;
export { useFormContext, useMetaDataForm };
