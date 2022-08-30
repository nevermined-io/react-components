import React, { useEffect, useState } from 'react';
import { Catalog, SubscribeService, EventResult } from '../src';
import { appConfig } from "./config";
import { renderHook, waitFor } from '@testing-library/react';

const wrapperProvider = ({ children }: { children: React.ReactElement }) => (
    <Catalog.NeverminedProvider config={appConfig}>{children}</Catalog.NeverminedProvider>
);

describe('Subscribe Integration', () => {
  it('should subscribe to payment events', async () => {
    const { result } = renderHook(
      () => {
        const { sdk, updateSDK } = Catalog.useNevermined();
        const { paymentEvents } = SubscribeService.useSubscribeToPaymentEvents();
        const [ eventResult, setEventResult ] = useState<EventResult[]>([])

        useEffect(() => {
          if (!sdk?.accounts) {
              updateSDK(appConfig);
              return;
          }

          (async () => {
            try {
              if ( paymentEvents.length ) {
                setEventResult([...paymentEvents])
              }
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [sdk, paymentEvents]);

        return eventResult;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(async () => {
      expect(result.current.length).toBeGreaterThan(0);
    }, {
      timeout: 100000
    });
  });

  it('should subscribe to transfer events', async() => {
    const { result } = renderHook(
      () => {
        const { sdk, updateSDK } = Catalog.useNevermined();
        const { transferEvents } = SubscribeService.useSubscribeToTransferEvents();
        const [ eventResult, setEventResult ] = useState<EventResult[]>([])

        useEffect(() => {
          if (!sdk?.accounts) {
              updateSDK(appConfig);
              return;
          }

          (async () => {
            try {
              if ( transferEvents.length ) {
                setEventResult([...transferEvents])
              }
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [sdk, transferEvents]);

        return eventResult;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(async () => {
      expect(result.current.length).toBeGreaterThan(0);
    }, {
      timeout: 100000
    });
  })
});