import React from 'react';
import { render, screen } from '@testing-library/react';
import { generateTestingUtils } from "eth-testing";
import { NeverminedProvider } from '../src/nevermined';
import { appConfig } from './config';

const setup = () => render(
    <NeverminedProvider config={appConfig}>
      <div>Hello nevermined</div>
    </NeverminedProvider>
)


describe('Nevermined context', () => {
  const testingUtils = generateTestingUtils({ providerType: "MetaMask" });
  beforeAll(() => {
    (global.window as any).ethereum = testingUtils.getProvider();
  })

  afterEach(() => {
    testingUtils.clearAllMocks();
  })

  it('Component load', () => {
    testingUtils.mockConnectedWallet(["0xf61B443A155b07D2b2cAeA2d99715dC84E839EEf"]);
    setup()
    expect(screen.getByText('Hello nevermined')).toBeInTheDocument();
  })
})