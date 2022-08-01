import React, {useEffect, useState} from 'react';
import { render, screen, renderHook, waitFor } from '@testing-library/react';
import { generateTestingUtils } from "eth-testing";
import { appConfig } from './config';
import { ddo } from './mockups'
import Catalog from '../src';
import { DDO } from '@nevermined-io/nevermined-sdk-js';

jest.mock('@nevermined-io/nevermined-sdk-js', () => ({
  ...jest.requireActual('@nevermined-io/nevermined-sdk-js'),
  Nevermined: {
    getInstance: async () => ({
      assets: {
        resolve: async () => jest.requireActual('./mockups').ddo
      }
    })
  }
}))

const wrapperProvider = ({children}: {children: React.ReactElement} ) => <Catalog.NeverminedProvider config={appConfig}>{children}</Catalog.NeverminedProvider>

const setup = (children: React.ReactElement) => render(
    <Catalog.NeverminedProvider config={appConfig}>
      {children}
    </Catalog.NeverminedProvider>
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
    setup(<h1>Hello nevermined</h1>)
    expect(screen.getByText('Hello nevermined')).toBeInTheDocument();
  })

  it('Should get single asset', async() => {
    testingUtils.mockConnectedWallet(["0xf61B443A155b07D2b2cAeA2d99715dC84E839EEf"]);

    const { result } = renderHook(() => {
      const { assets, isLoadingSDK, updateSDK } = Catalog.useNevermined()
      const [asset, setAsset] = useState<DDO>({} as DDO)

      useEffect(() => {
        if(isLoadingSDK) {
          appConfig.web3Provider = testingUtils.getProvider();
          updateSDK(appConfig)
          return
        }

        (async() => {
          try {
            const result = await assets.getSingle(ddo.id);
            setAsset(result)
          } catch (error: any) {
            console.error(error.message)
          }
        })()
      }, [isLoadingSDK])

      return asset;
    }, {
      wrapper: wrapperProvider
    });

    await waitFor(async () => {
      expect(result.current).toStrictEqual(ddo);
    })
  })
})