import React, { useEffect, useState } from 'react';
import { Catalog, EventService, Transfer, FullfilledOrders, RegisterEvent } from '../src';
import { appConfig, walletAddress } from "./config";
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
            console.log(result.current);
          }, {
            timeout: 100000
          });
    });

    it('should get full filled events by the user', async () => {
      const { result } = renderHook(
        () => {
          const { sdk, updateSDK } = Catalog.useNevermined();
          const [events, setEvents] = useState<FullfilledOrders[]>([]);
  
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
        expect(result.current.length).toBeTruthy();
        console.log(result.current);
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
        expect(result.current.length).toBeTruthy();
        console.log(result.current);
      }, {
        timeout: 100000
      });
    });
});