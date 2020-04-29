export class BotError extends Error {
  public constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BotError);
    }

    this.name = 'BotError';
  }
}
export class UserError extends Error {
  public constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserError);
    }

    this.name = 'UserError';
  }
}
