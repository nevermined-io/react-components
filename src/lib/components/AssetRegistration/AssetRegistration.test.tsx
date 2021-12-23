import React, { ReactNode } from 'react';
import AssetRegistration from './AssetRegistration';
import { render, fireEvent } from '@testing-library/react';
import MetaDataFormProvider from '../../contexts/forms/MetaDataFormProvider';

const renderWithProvider = (comp: ReactNode) => {
  return render(<MetaDataFormProvider>{comp}</MetaDataFormProvider>);
};

describe('AssetRegistration', () => {
  it('should render with default values', () => {
    const screen = renderWithProvider(<AssetRegistration className="asset-registration" />);
    const { container } = screen;

    expect(container.querySelector('.asset-registration')).toBeInTheDocument();
    expect(container.querySelector('.registration-step')).toBeInTheDocument();
    expect(container.querySelector('.asset-registration__button-container')).toBeInTheDocument();
    expect(container.querySelectorAll('.asset-registration__button-secondary')).toHaveLength(1);

    expect(container.querySelector('.asset-registration__button-primary')).not.toBeInTheDocument();
    expect(container.querySelector('h1')).toHaveTextContent('Asset Registration, Current Step: 0');
    const button = screen.getByRole('button', { name: 'Next' });

    fireEvent.click(button);
    expect(container.querySelectorAll('.asset-registration__button-secondary')).toHaveLength(2);
    expect(container.querySelector('h1')).toHaveTextContent('Asset Registration, Current Step: 1');

    fireEvent.click(button);
    expect(container.querySelectorAll('.asset-registration__button-secondary')).toHaveLength(1);
    expect(container.querySelector('.asset-registration__button-primary')).toBeInTheDocument();
    expect(container.querySelector('h1')).toHaveTextContent('Asset Registration, Current Step: 2');

    let backButton = screen.getByRole('button', { name: 'Previous' });
    fireEvent.click(backButton);
    expect(container.querySelectorAll('.asset-registration__button-secondary')).toHaveLength(2);
    expect(container.querySelector('h1')).toHaveTextContent('Asset Registration, Current Step: 1');

    backButton = screen.getByRole('button', { name: 'Previous' });
    fireEvent.click(backButton);
    expect(container.querySelectorAll('.asset-registration__button-secondary')).toHaveLength(1);
    expect(container.querySelector('h1')).toHaveTextContent('Asset Registration, Current Step: 0');
  });
});
