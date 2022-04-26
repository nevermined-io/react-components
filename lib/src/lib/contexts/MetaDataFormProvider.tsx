//import { MetaDataFormDTO, MetaDataFormProviderProps, MetaDataFormProviderValue } from '../types';
//import React, { createContext, useContext } from 'react';
////import { FormProvider, useForm, useFormContext } from 'react-hook-form';
//
//const MetaDataFormProvider = ({
//children,
//defaultValues = {
//author: '',
//name: '',
//price: '0',
//description: '',
//files: []
//}
//}: MetaDataFormProviderProps) => {
//const formContextProps = useForm<MetaDataFormDTO>({
//mode: 'onBlur',
//defaultValues
//});
//
//return <FormProvider {...formContextProps}>{children}</FormProvider>;
//};
//
//const MetaDataFormContext = createContext({} as MetaDataFormProviderValue);
//
//// Helper hook to access the provider values
//const useMetaDataForm = (): MetaDataFormProviderValue => useContext(MetaDataFormContext);
//
//export default MetaDataFormProvider;
//export { useFormContext, useMetaDataForm };
export {};
