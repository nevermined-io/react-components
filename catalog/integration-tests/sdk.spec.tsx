import React from 'react'
import { initializeNevermined } from '../src/catalog'
import { Catalog } from '../src'
import { appConfig } from './config'
import { render, screen } from '@testing-library/react'

const setup = (children: React.ReactElement) =>
  render(<Catalog.NeverminedProvider config={appConfig}>{children}</Catalog.NeverminedProvider>)

describe('SDK Integration', () => {
  it('should initialize sdk successfully', async () => {
    const response = await initializeNevermined(appConfig)
    expect(response.success).toEqual(true)
  })

  it('should create Catalog provider successfully', async () => {
    setup(<h1>Hello nevermined</h1>)
    expect(screen.getByText('Hello nevermined')).toBeInTheDocument()
  })
})
