import React, { ReactNode } from 'react';
import FormField from './FormField';
import { render } from '@testing-library/react';
import MetaDataFormProvider from '../../contexts/forms/MetaDataFormProvider';

const renderWithProvider = (comp: ReactNode) => {
  return render(<MetaDataFormProvider>{comp}</MetaDataFormProvider>);
};

describe('FormField', () => {
  it('renders textarea', () => {
    const { container } = renderWithProvider(
      <FormField label="Yo" type="textarea" className="test-class" id="test" />
    );

    expect(container.querySelector('textarea')).toBeInTheDocument();
    expect(container.querySelector('label')).toHaveClass('test-class-label');
  });

  it('renders text input', () => {
    const { container } = renderWithProvider(
      <FormField label="Yo" type="text" className="test-class" id="test" />
    );

    expect(container.querySelector('input[type="text"]')).toBeInTheDocument();
    expect(container.querySelector('label')).toHaveClass('test-class-label');
  });

  it('renders number input', () => {
    const { container } = renderWithProvider(
      <FormField label="Yo" type="number" className="test-class" id="test" />
    );

    expect(container.querySelector('input[type="number"]')).toBeInTheDocument();
    expect(container.querySelector('input[type="number"]')).toHaveClass('test-class-number');
    expect(container.querySelector('label')).toHaveClass('test-class-label');
  });

  it('renders checkbox input', () => {
    const { container } = renderWithProvider(
      <FormField label="Yo" type="checkbox" className="test-class" id="test" />
    );

    expect(container.querySelector('input[type="checkbox"]')).toBeInTheDocument();
    expect(container.querySelector('label')).toHaveClass('test-class-label');
  });
});