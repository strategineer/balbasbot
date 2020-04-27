const util = require("../util.js");
const cmds = require("../commands.js");
const error = require("../error.js");

function run(args, context, done) {
  const commandChoices = cmds.getCommandsForUser(context.username);
  if (!args[0]) {
    throw new error.UserError(
      `Get help on specific commands by running '!help [${commandChoices}]'`
    );
  }
  const subCommand = util.queryFrom(args[0], commandChoices);
  let res = [];
  for (h of util.data.commands.details[subCommand].help) {
    res.push(`${subCommand} ${h.example}: ${h.description})`);
  }
  done(res.join(", "));
}
exports.run = run;
