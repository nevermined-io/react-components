export class TransferError extends Error {
  constructor(aggreementId: string) {
    super(aggreementId)
  }
}
