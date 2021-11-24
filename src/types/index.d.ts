type FormInformation = {
    label: string;
    value: string;
    type: 'select' | 'text' | 'textarea' | 'number' | 'checkbox' | 'radio';
    rows?: number;
    cols?: number;
    min?: number;
    max?: number;
    step?: number;
};

export { FormInformation }
