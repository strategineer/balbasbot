const util = require('../util.js')
const cmds = require('../commands.js')

function run(args, context) {
    const commandChoices = cmds.getCommandsForUser(context.username);
    if (!args[0]) {
        return `Get help on specific commands by running '!help [${commandChoices}]'`;
    }
    const subCommand = util.queryFrom(args[0], commandChoices);
    if (!subCommand) {
        return;
    }
    if (!(subCommand in util.data.commands.details)) {
        return `${subCommand} is not a known command`;
    }
    let res = [];
    for (h of util.data.commands.details[subCommand].help) {
        res.push(`${subCommand} ${h.example}: ${h.description})`);
    }
    return res.join(', ');
}
exports.run = run;
