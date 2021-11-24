type FormInformation = {
    label: string;
    value: string;
    type: 'select' | 'text' | 'textarea' | 'number';
    rows?: number;
    cols?: number;
};

export { FormInformation }
