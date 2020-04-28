import util = require('./util');
import error = require('./error');

export function getPermissionLevel(username) {
  if (!username) {
    throw new error.BotError();
  }
  if (username === util.data.users.me) {
    return 0;
  } else if (util.data.users.mods.includes(username)) {
    return 1;
  }
  return 2;
}
