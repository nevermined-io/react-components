import React, { ReactNode } from 'react';
import RegistrationStep from './RegistrationStep';
import { render } from '@testing-library/react';
import MetaDataFormProvider from '../../contexts/forms/MetaDataFormProvider';

const renderWithProvider = (comp: ReactNode) => {
  return render(<MetaDataFormProvider>{comp}</MetaDataFormProvider>);
};

describe('RegistrationStep', () => {
  it('renders without formfields', () => {
    const { container } = renderWithProvider(
      <RegistrationStep className="registration-step" title="yo" fields={[]} />
    );

    expect(container.querySelector('.registration-step')).toBeInTheDocument();
    expect(container.querySelector('.registration-step__form')).toBeInTheDocument();
    expect(container.querySelector('.registration-step__form-list')).toBeInTheDocument();
    expect(
      container
        .querySelector('.registration-step__form-list')
        ?.querySelector('registration-step__formfield')
    ).not.toBeInTheDocument();
  });

  it('renders with formfields', () => {
    const { container } = renderWithProvider(
      <RegistrationStep
        className="registration-step"
        title="yo"
        fields={[
          { label: 'test', id: 'test', type: 'text' },
          { label: 'test2', id: 'test2', type: 'number' }
        ]}
      />
    );

    expect(container.querySelector('.registration-step')).toBeInTheDocument();
    expect(container.querySelector('.registration-step__form')).toBeInTheDocument();
    expect(container.querySelector('.registration-step__form-list')).toBeInTheDocument();
    expect(container.querySelectorAll('.registration-step__formfield')).toHaveLength(2);
    expect(container.querySelectorAll('.registration-step__formfield-label')).toHaveLength(2);
    expect(container.querySelectorAll('input[type="text"]')).toHaveLength(1);
    expect(container.querySelectorAll('input[type="number"]')).toHaveLength(1);
  });

  it('renders title as string', () => {
    const title = 'yo';
    const { container } = renderWithProvider(
      <RegistrationStep className="registration-step" title={title} fields={[]} />
    );
    expect(container.querySelector('legend')).toBeInTheDocument();
    expect(container.querySelector('legend')).toHaveTextContent(title);
  });

  it('renders title as custom component', () => {
    const title = <h1>React title</h1>;
    const { container } = renderWithProvider(
      <RegistrationStep className="registration-step" title={title} fields={[]} />
    );
    expect(container.querySelector('h1')).toBeInTheDocument();
    expect(container.querySelector('h1')).toHaveTextContent('React title');
  });
});
