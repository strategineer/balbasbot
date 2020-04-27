const util = require("./util.js");
const perms = require("./permissions.js");
const error = require("./error.js");

function getCommandsForUser(username) {
  if (!username) {
    throw new error.BotError();
  }
  const permissionLevel = perms.getPermissionLevel(username);
  return util.data.commands.choices.filter(
    (c) => util.data.commands.details[c].permissions >= permissionLevel
  );
}
exports.getCommandsForUser = getCommandsForUser;
