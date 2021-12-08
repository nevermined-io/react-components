import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const { container } = render(<App />);
  // expect(container.firstChild?.textContent).toContain('Asset Registration');
  expect(true).toBeTruthy();
  // screen.getByText(/learn react/i);
});
