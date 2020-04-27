const util = require("../util.js");
const database = require("../database.js");
const cmds = require("../commands.js");
const error = require("../error.js");

function run(config, args, context, done) {
  const commandChoices = cmds.getCommandsForUser(context.username);
  if (!args[0]) {
    throw new error.UserError(
      `Get help on specific commands by running '!help [${commandChoices}]'`
    );
  }
  const subCommand = util.queryFrom(args[0], config.commands);
  args.shift();
  if (subCommand === "reset") {
    const documentsToDelete = args[0]
      ? args
      : util.data.database.documents.map((d) => {
          return d.name;
        });
    for (c of documentsToDelete) {
      console.log(`deleting ${c}`);
      database.run(c, function (db, collection) {
        collection.deleteMany({});
      });
    }
  }
  done();
}
exports.run = run;
