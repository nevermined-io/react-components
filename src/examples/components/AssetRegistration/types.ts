import { MetaDataFormDTO } from "lib/contexts/MetaDataFormProvider";

export interface FormFieldData {
  label: string;
  id: string | keyof MetaDataFormDTO;
  type: 'select' | 'text' | 'textarea' | 'number' | 'checkbox' | 'radio' | 'file';
  rows?: number;
  cols?: number;
  min?: number;
  max?: number;
  step?: number;
  multiple?: boolean;
  mimeType?: string;
}

export interface AssetRegistrationProps {
  styles?: {
    root?: string;
    navigationButtonContainer?: string;
    registrationStep?: string;
  };
  className?: string;
  debug?: boolean;
  onSubmit?: (data: any) => void;
  onSubmitError?: (error: any) => void;
  detailFields?: Array<FormFieldData>;
  authorshipFields?: Array<FormFieldData>;
  pricingFields?: Array<FormFieldData>;
}
