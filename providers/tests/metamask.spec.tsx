import React from 'react';
import { render, screen } from '@testing-library/react';
import { generateTestingUtils } from "eth-testing";
import { MetaMask } from '../src';
import { ChainConfig } from './chainConfig';

const setup = () => render(
    <MetaMask.WalletProvider chainConfig={ChainConfig} correctNetworkId='0x13881' nodeUri='http://localhost:8545'>
      <div>Hello metamask</div>
    </MetaMask.WalletProvider>
)


describe('Metamask context', () => {
  const testingUtils = generateTestingUtils({ providerType: "MetaMask" });
  beforeAll(() => {
    global.window.ethereum = testingUtils.getProvider();
  })

  afterEach(() => {
    testingUtils.clearAllMocks();
  })


  it('Component load', () => {
    testingUtils.mockConnectedWallet(["0xf61B443A155b07D2b2cAeA2d99715dC84E839EEf"]);
    setup()
    expect(screen.getByText('Hello metamask')).toBeInTheDocument();
  })
})