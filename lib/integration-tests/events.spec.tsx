import React, { useEffect, useState } from 'react';
import { Catalog, EventService, Transfer, FulfilledOrders, RegisterEvent } from '../src';
import { appConfig, walletAddress, did } from "./config";
import { renderHook, waitFor } from '@testing-library/react';

const wrapperProvider = ({ children }: { children: React.ReactElement }) => (
    <Catalog.NeverminedProvider config={appConfig}>{children}</Catalog.NeverminedProvider>
);

describe('Events Integration', () => {
  it('should get transfer events', async () => {
    const { result } = renderHook(
      () => {
        const { sdk, updateSDK } = Catalog.useNevermined();
        const [events, setEvents] = useState<Transfer[]>([]);

        useEffect(() => {
          if (!sdk?.accounts) {
              updateSDK(appConfig);
              return;
          }

          (async () => {
            try {
              const result = await EventService.getTransfers(sdk, walletAddress);
              setEvents([...result]);
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [sdk]);

        return events;
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

  it('should get fulfilled events by the user', async () => {
    const eventServiceSpy = jest.spyOn(EventService, 'getUserFulfilledEvents');

    renderHook(
      () => {
        const { sdk, updateSDK } = Catalog.useNevermined();
        const [events, setEvents] = useState<FulfilledOrders[]>([]);

        useEffect(() => {
          if (!sdk?.accounts) {
              updateSDK(appConfig);
              return;
          }

          (async () => {
            try {
              const result = await EventService.getUserFulfilledEvents(sdk, walletAddress);
              setEvents([...result]);
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [sdk]);

        return events;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(async () => {
      expect(eventServiceSpy).toBeCalledTimes(1);
    }, {
      timeout: 100000
    });
  });

  it('should get register events by the user', async () => {
    const { result } = renderHook(
      () => {
        const { sdk, updateSDK } = Catalog.useNevermined();
        const [events, setEvents] = useState<RegisterEvent[]>([]);

        useEffect(() => {
          if (!sdk?.accounts) {
              updateSDK(appConfig);
              return;
          }

          (async () => {
            try {
              const result = await EventService.getUserRegisterEvents(sdk, walletAddress);
              setEvents([...result]);
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [sdk]);

        return events;
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

  it('should get register events by an asset', async () => {
    const { result } = renderHook(
      () => {
        const { sdk, updateSDK } = Catalog.useNevermined();
        const [events, setEvents] = useState<RegisterEvent[]>([]);

        useEffect(() => {
          if (!sdk?.accounts) {
              updateSDK(appConfig);
              return;
          }

          (async () => {
            try {
              const result = await EventService.getAssetRegisterEvent(did, `${appConfig.graphHttpUri}mumbaiv2`);
              setEvents([...result]);
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [sdk]);

        return events;
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
    
});