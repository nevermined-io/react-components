import React from 'react'
import { render, screen } from '@testing-library/react'
import { generateTestingUtils } from 'eth-testing'
import { appConfig } from './config'
import { walletAddress } from './mockups'
import { Catalog } from '../src'

jest.mock('@nevermined-io/sdk', () => ({
  ...jest.requireActual('@nevermined-io/sdk'),
  Nevermined: jest.requireActual('./mockups').nevermined
}))

const setup = (children: React.ReactElement) =>
  render(<Catalog.NeverminedProvider config={appConfig}>{children}</Catalog.NeverminedProvider>)

describe('Catalog provider', () =>{
  const testingUtils = generateTestingUtils({ providerType: 'MetaMask' })

  it('Component load', () => {
    testingUtils.mockConnectedWallet([walletAddress])
    setup(<h1>Hello nevermined</h1>)
    expect(screen.getByText('Hello nevermined')).toBeInTheDocument()
  })
})