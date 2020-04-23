const util = require('./util.js')
const perms = require('./permissions.js')

function getCommandsForUser(username) {
    const permissionLevel = perms.getPermissionLevel(username);
    return util.data.commands.choices.filter(c => util.data.commands.details[c].permissions >= permissionLevel)
}
exports.getCommandsForUser = getCommandsForUser;
