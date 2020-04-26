class BotError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BotError);
    }

    this.name = "BotError";
  }
}
exports.BotError = BotError;

class UserError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserError);
    }

    this.name = "UserError";
  }
}
exports.UserError = UserError;
