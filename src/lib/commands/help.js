const util = require("../util.js");
const cmds = require("../commands.js");

function run(config, args, context, done) {
  if (!args[0]) {
    util.throwDefaultUserError(context.username);
  }
  const commandChoices = cmds.getCommandsForUser(context.username);
  const subCommand = util.queryFrom(args[0], commandChoices);
  done(util.getCommandUsageHelp(subCommand));
}
exports.run = run;
