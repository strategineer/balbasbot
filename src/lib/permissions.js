const util = require("./util.js");
const error = require("./error.js");

function getPermissionLevel(username) {
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
exports.getPermissionLevel = getPermissionLevel;
