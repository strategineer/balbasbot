import util = require('./util');
import perms = require('./permissions');
import error = require('./error');

export function getCommandsForUser(username: string): string[] {
  if (!username) {
    throw new error.BotError();
  }
  const permissionLevel = perms.getPermissionLevel(username);
  return util.data.commands
    .filter((c) => c.permissions >= permissionLevel)
    .map((c) => c.name);
}
