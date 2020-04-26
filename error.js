class BotError extends Error {
  constructor(message) {
    super(message);
    this.name = "BotError";
    Error.captureStackTrace(this, BotError);
  }
}
exports.BotError = BotError;

class UserError extends Error {
  constructor(message) {
    super(message);
    this.name = "UserError";
    Error.captureStackTrace(this, UserError);
  }
}
exports.UserError = UserError;
