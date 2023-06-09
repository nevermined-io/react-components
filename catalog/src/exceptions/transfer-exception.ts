export class TransferError extends Error {
  public agreementId: string

  constructor(aggreementId: string, message: string) {
    super(`Transfer error: ${message}`)
    this.agreementId = aggreementId
  }
}
