import '@testing-library/jest-dom'
import 'jest-fetch-mock'
import Crypto from '@trust/webcrypto'
import { TextEncoder, TextDecoder } from 'util'

global.crypto = Crypto
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any
