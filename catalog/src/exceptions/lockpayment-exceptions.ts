export class LockPaymentError extends Error {
  constructor(message: string) {
    super(`Lock payment error: ${message}`)
  }
}
