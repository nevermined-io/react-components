import React, { useEffect, useState } from 'react';
import { Catalog, getAgreementId, loadFulfilledEvents } from '../src';
import { appConfig, did, walletAddress } from "./config";
import { renderHook, waitFor } from '@testing-library/react';

const wrapperProvider = ({ children }: { children: React.ReactElement }) => (
    <Catalog.NeverminedProvider config={appConfig}>{children}</Catalog.NeverminedProvider>
);

describe('Utils Integration', () => {
  it('should get agreementId', async () => {
    let getAgreementIdSpy: unknown;

    renderHook(
        () => {
          const { sdk, updateSDK } = Catalog.useNevermined();
          const [ agreementId , setAgreementId] = useState<string>('');
  
          useEffect(() => {
            if (!sdk?.accounts) {
                updateSDK(appConfig);
                return;
            }
  
            (async () => {
              try {
                getAgreementIdSpy = jest.spyOn(sdk.keeper.templates.nftAccessTemplate.events, 'getPastEvents');
                const result = await getAgreementId(sdk, 'nftAccessTemplate', did);
                setAgreementId(result);
              } catch (error: any) {
                console.error(error.message);
              }
            })();
          }, [sdk]);
  
          return agreementId;
        },
        {
          wrapper: wrapperProvider
        }
      );
  
      await waitFor(async () => {
        expect(getAgreementIdSpy).toBeCalledTimes(1);
      }, {
        timeout: 100000
      });
  });

  it('should load fulfilled events', async() => {
    let loadFulfilledEventsSpy: unknown;
    renderHook(
      () => {
        const { sdk, updateSDK } = Catalog.useNevermined();
        const [ fulfilledEvents , setFulfilledEvents] = useState<{ documentId: string }[]>([]);

        useEffect(() => {
          if (!sdk?.accounts) {
              updateSDK(appConfig);
              return;
          }

          (async () => {
            try {
              loadFulfilledEventsSpy = jest.spyOn(sdk.keeper.conditions.nftAccessCondition.events, 'getPastEvents');
              const result = await loadFulfilledEvents(sdk, walletAddress, 'nftAccessCondition')
              setFulfilledEvents([...result]);
            } catch (error: any) {
              console.error(error.message);
            }
          })();
        }, [sdk]);

        return fulfilledEvents;
      },
      {
        wrapper: wrapperProvider
      }
    );

    await waitFor(async () => {
      expect(loadFulfilledEventsSpy).toBeCalledTimes(1);
    }, {
      timeout: 100000
    });
  })
});