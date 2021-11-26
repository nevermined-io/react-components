export class MessageSignatureDeniedError extends Error {
  constructor(message = 'Message signature denied') {
    super(message);

    this.name = 'MessageSignatureDeniedError';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MessageSignatureDeniedError);
    }
  }
}

export class BadGatewayAddressError extends Error {
  constructor(
    message = "Bad Gateway API address. Did you forget to set the 'gatewayAddress' parameter in the nevermined config?"
  ) {
    super(message);

    this.name = 'BadGatewayAddressError';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BadGatewayAddressError);
    }
  }
}

export const ERRORS = {
  4001: MessageSignatureDeniedError
};
