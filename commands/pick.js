const util = require('../util.js')

function run(args, client, target, context, msg, self) {
    const defaultValue = args[0] ? undefined : 'team';
    const subCommand = util.queryFrom(args[0], util.data.commands.details['pick'].commands, client, target, defaultValue);
    let picked = '';
    if (subCommand === 'skill') {
        args.shift();
        const skillTypesFilter = args[0] ? args.filter(c => !(c in util.data.bloodBowl.skills.all)) : util.data.bloodBowl.skills.default;
        let skills = [];
        for (s of skillTypesFilter) {
            skills = skills.concat(util.data.bloodBowl.skills.byCategory[s]);
        }
        picked = util.pick(skills);
        client.say(target, `${picked}? (using ${skillTypesFilter})`);
    } else if (subCommand === 'team') {
        picked = util.pick(util.data.bloodBowl.teams);
        client.say(target, `${picked}?`);
    } else {
        console.log(`* Unknown !pick ${subCommand}`);
        return;
    }
}
exports.run = run;
