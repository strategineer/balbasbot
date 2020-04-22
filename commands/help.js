const util = require('../util.js')

function run(args, client, target, context, msg, self) {
    if (!args[0]) {
        client.say(target, `Get help on specific commands by running '!help [${util.data.commands.choices}]'`);
        return;
    }
    const subCommand = util.queryFrom(args[0], util.data.commands.choices, client, target);
    if (!subCommand) {
        return;
    }
    if (!(subCommand in util.data.commands.details)) {
        client.say(target, `${subCommand} is not a known command`);
        return;
    }
    let res = ''
    for (h of util.data.commands.details[subCommand].help) {
        res = res + `${h.example}: ${h.description}, `;
    }
    client.say(target, res);
}
exports.run = run;
