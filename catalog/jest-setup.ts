import '@testing-library/jest-dom'
import 'jest-fetch-mock'
import 'jest-location-mock'
import Crypto from '@trust/webcrypto'
import { TextEncoder, TextDecoder } from 'util'

class Worker {
  url: string
  onmessage: (msg?: string) => void

  constructor(stringUrl: string) {
    this.url = stringUrl
    this.onmessage = () => void {}
  }
  
  postMessage(msg: string) {
    this.onmessage(msg)
  }
}

global.crypto = Crypto
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any
(window as any).Worker = Worker
