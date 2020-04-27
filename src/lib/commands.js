const util = require("./util.js");
const perms = require("./permissions.js");
const error = require("./error.js");

function getCommandsForUser(username) {
  if (!username) {
    throw new error.BotError();
  }
  const permissionLevel = perms.getPermissionLevel(username);
  return util.data.commands
    .filter((c) => c.permissions >= permissionLevel)
    .map((c) => c.name);
}
exports.getCommandsForUser = getCommandsForUser;
