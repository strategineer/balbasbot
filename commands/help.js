const util = require('../util.js')
const cmds = require('../commands.js')

function run(args, client, target, context, msg, self) {
    const commandChoices = cmds.getCommandsForUser(context.username);
    if (!args[0]) {
        client.say(target, `Get help on specific commands by running '!help [${commandChoices}]'`);
        return;
    }
    const subCommand = util.queryFrom(args[0], commandChoices, client, target);
    if (!subCommand) {
        return;
    }
    if (!(subCommand in util.data.commands.details)) {
        client.say(target, `${subCommand} is not a known command`);
        return;
    }
    let res = [];
    for (h of util.data.commands.details[subCommand].help) {
        res.push(`${subCommand} ${h.example}: ${h.description})`);
    }
    client.say(target, res.join(', '));
}
exports.run = run;
