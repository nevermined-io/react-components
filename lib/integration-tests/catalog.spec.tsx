import React, { useEffect, useState } from 'react';
import { Catalog, EventResult } from '../src';
import { appConfig } from "./config";
import { renderHook, waitFor } from '@testing-library/react';

const wrapperProvider = ({ children }: { children: React.ReactElement }) => (
    <Catalog.NeverminedProvider config={appConfig}>{children}</Catalog.NeverminedProvider>
);

describe('Catalog Integration', () => {
  it('should subscribe to payment events', async () => {
    const { result } = renderHook(
      () => {
        const { sdk, updateSDK, subscribe } = Catalog.useNevermined();
        const [ eventResult, setEventResult ] = useState<EventResult[]>([]);

        useEffect(() => {
          if (!sdk?.accounts) {
              updateSDK(appConfig);
              return;
          }

          (async () => {
            try {
              await subscribe.paymentEvents((events) => setEventResult(events));
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [sdk, eventResult]);

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
        const { sdk, updateSDK, subscribe } = Catalog.useNevermined();
        const [ eventResult, setEventResult ] = useState<EventResult[]>([])

        useEffect(() => {
          if (!sdk?.accounts) {
              updateSDK(appConfig);
              return;
          }

          (async () => {
            try {
              await subscribe.transferEvents((events) => setEventResult(events));
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [sdk, eventResult]);

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