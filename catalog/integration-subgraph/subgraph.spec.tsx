import React, { useEffect, useState } from 'react'
import {
  Catalog,
  EventResult,
  Transfer,
  getAgreementId,
  SubscribeService,
  EventService,
  RegisterEvent,
  DDO,
} from '../src'
import { appConfig } from './config'
import { renderHook, waitFor } from '@testing-library/react'
import { runWorkflow } from './utils'

const wrapperProvider = ({ children }: { children: React.ReactElement }) => (
  <Catalog.NeverminedProvider config={appConfig}>{children}</Catalog.NeverminedProvider>
)

describe('subgraph', () => {
  let ddo: DDO
  let publisherAddress: string
  let consumerAddress: string

  beforeAll(async () => {
    const { ddo, publisherAddress, consumerAddress } = await runWorkflow()
    console.log(ddo, publisherAddress, consumerAddress)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Utils Integration', () => {
    it('should get agreementId', async () => {
      const { result } = renderHook(
        () => {
          const { sdk, updateSDK } = Catalog.useNevermined()
          const [agreementId, setAgreementId] = useState<string>('')

          useEffect(() => {
            if (!sdk?.accounts) {
              updateSDK(appConfig)
              return
            }

            void (async () => {
              try {
                const result = await getAgreementId(sdk, 'nftSalesTemplate', ddo.shortId())
                setAgreementId(result)
              } catch (error: any) {
                console.error(error.message)
              }
            })()
          }, [sdk])

          return agreementId
        },
        {
          wrapper: wrapperProvider,
        },
      )

      await waitFor(
        async () => {
          expect(result.current.length).toBeGreaterThan(1)
        },
        {
          timeout: 10000,
        },
      )
    })
  })

  describe('Catalog Integration', () => {
    it('should get all the asset publised from the address passed by argument', async () => {
      const { result } = renderHook(
        () => {
          const { sdk, updateSDK, account } = Catalog.useNevermined()
          const [dids, setDids] = useState<string[]>([])

          useEffect(() => {
            if (!sdk?.accounts) {
              updateSDK(appConfig)
              return
            }

            void (async () => {
              try {
                const result = await account.getReleases(publisherAddress)
                setDids(result)
              } catch (error: any) {
                console.error(error.message)
              }
            })()
          }, [sdk, dids])

          return dids
        },
        {
          wrapper: wrapperProvider,
        },
      )

      await waitFor(
        async () => {
          expect(result.current.length).toBeGreaterThan(0)
        },
        {
          timeout: 10000,
        },
      )
    })
    it('should get the assets bought by the address given', async () => {
      const { result } = renderHook(
        () => {
          const { sdk, updateSDK, account } = Catalog.useNevermined()
          const [dids, setDids] = useState<string[]>([])

          useEffect(() => {
            if (!sdk?.accounts) {
              updateSDK(appConfig)
              return
            }

            void (async () => {
              try {
                const result = await account.getCollection(consumerAddress)
                setDids(result)
              } catch (error: any) {
                console.error(error.message)
              }
            })()
          }, [sdk, dids])

          return dids
        },
        {
          wrapper: wrapperProvider,
        },
      )

      await waitFor(
        async () => {
          expect(result.current.length).toBeGreaterThan(0)
        },
        {
          timeout: 10000,
        },
      )
    })
    it('should subscribe to payment events', async () => {
      runWorkflow()
      const { result } = renderHook(
        () => {
          const { sdk, updateSDK, subscribe } = Catalog.useNevermined()
          const [eventResult, setEventResult] = useState<EventResult[]>([])

          useEffect(() => {
            if (!sdk?.accounts) {
              updateSDK(appConfig)
              return
            }

            void (async () => {
              try {
                await subscribe.paymentEvents((events) => setEventResult(events))
              } catch (error: any) {
                console.error(error.message)
              }
            })()
          }, [sdk, eventResult])

          return eventResult
        },
        {
          wrapper: wrapperProvider,
        },
      )

      await waitFor(
        async () => {
          expect(result.current.length).toBeGreaterThan(0)
        },
        {
          timeout: 10000,
        },
      )
    })

    it('should subscribe to transfer events', async () => {
      const { result } = renderHook(
        () => {
          const { sdk, updateSDK, subscribe } = Catalog.useNevermined()
          const [eventResult, setEventResult] = useState<EventResult[]>([])

          useEffect(() => {
            if (!sdk?.accounts) {
              updateSDK(appConfig)
              return
            }

            void (async () => {
              try {
                await subscribe.transferEvents((events) => setEventResult(events))
              } catch (error: any) {
                console.error(error.message)
              }
            })()
          }, [sdk, eventResult])

          return eventResult
        },
        {
          wrapper: wrapperProvider,
        },
      )

      await waitFor(
        async () => {
          expect(result.current.length).toBeGreaterThan(0)
        },
        {
          timeout: 10000,
        },
      )
    })
  })
  describe('Subscribe Integration', () => {
    it('should subscribe to payment events', async () => {
      const { result } = renderHook(
        () => {
          const { sdk, updateSDK } = Catalog.useNevermined()
          const { paymentEvents } = SubscribeService.useSubscribeToPaymentEvents()
          const [eventResult, setEventResult] = useState<EventResult[]>([])

          useEffect(() => {
            if (!sdk?.accounts) {
              updateSDK(appConfig)
              return
            }

            void (async () => {
              try {
                if (paymentEvents.length) {
                  setEventResult([...paymentEvents])
                }
              } catch (error: any) {
                console.error(error.message)
              }
            })()
          }, [sdk, paymentEvents])

          return eventResult
        },
        {
          wrapper: wrapperProvider,
        },
      )

      await waitFor(
        async () => {
          expect(result.current.length).toBeGreaterThan(0)
        },
        {
          timeout: 10000,
        },
      )
    })

    it('should subscribe to transfer events', async () => {
      const { result } = renderHook(
        () => {
          const { sdk, updateSDK } = Catalog.useNevermined()
          const { transferEvents } = SubscribeService.useSubscribeToTransferEvents()
          const [eventResult, setEventResult] = useState<EventResult[]>([])

          useEffect(() => {
            if (!sdk?.accounts) {
              updateSDK(appConfig)
              return
            }

            void (async () => {
              try {
                if (transferEvents.length) {
                  setEventResult([...transferEvents])
                }
              } catch (error: any) {
                console.error(error.message)
              }
            })()
          }, [sdk, transferEvents])

          return eventResult
        },
        {
          wrapper: wrapperProvider,
        },
      )

      await waitFor(
        async () => {
          expect(result.current.length).toBeGreaterThan(0)
        },
        {
          timeout: 10000,
        },
      )
    })
  })
  describe('Events Integration', () => {
    it('should get transfer events', async () => {
      const { result } = renderHook(
        () => {
          const { sdk, updateSDK } = Catalog.useNevermined()
          const [events, setEvents] = useState<Transfer[]>([])

          useEffect(() => {
            if (!sdk?.accounts) {
              updateSDK(appConfig)
              return
            }

            void (async () => {
              try {
                const result = await EventService.getTransfers(sdk, consumerAddress)
                setEvents([...result])
              } catch (error: any) {
                console.error(error.message)
              }
            })()
          }, [sdk])

          return events
        },
        {
          wrapper: wrapperProvider,
        },
      )

      await waitFor(
        async () => {
          expect(result.current.length).toBeGreaterThan(0)
        },
        {
          timeout: 10000,
        },
      )
    })

    it('should get register events by the user', async () => {
      const { result } = renderHook(
        () => {
          const { sdk, updateSDK } = Catalog.useNevermined()
          const [events, setEvents] = useState<RegisterEvent[]>([])

          useEffect(() => {
            if (!sdk?.accounts) {
              updateSDK(appConfig)
              return
            }

            void (async () => {
              try {
                const result = await EventService.getUserRegisterEvents(sdk, publisherAddress)
                setEvents([...result])
              } catch (error: any) {
                console.error(error.message)
              }
            })()
          }, [sdk])

          return events
        },
        {
          wrapper: wrapperProvider,
        },
      )

      await waitFor(
        async () => {
          expect(result.current.length).toBeGreaterThan(0)
        },
        {
          timeout: 10000,
        },
      )
    })

    it('should get register events by an asset', async () => {
      const { result } = renderHook(
        () => {
          const { sdk, updateSDK } = Catalog.useNevermined()
          const [events, setEvents] = useState<RegisterEvent[]>([])

          useEffect(() => {
            if (!sdk?.accounts) {
              updateSDK(appConfig)
              return
            }

            void (async () => {
              try {
                const result = await EventService.getAssetRegisterEvent(sdk, ddo.shortId())
                setEvents([...result])
              } catch (error: any) {
                console.error(error.message)
              }
            })()
          }, [sdk])

          return events
        },
        {
          wrapper: wrapperProvider,
        },
      )

      await waitFor(
        async () => {
          expect(result.current.length).toBeGreaterThan(0)
        },
        {
          timeout: 10000,
        },
      )
    })
  })
})
