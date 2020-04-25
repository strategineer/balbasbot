const util = require('../util.js')

function run(args, client, target, context, msg, self) {
    const parsed = parseInt(args[0], 10);
    if (!isNaN(parsed)) { 
        const num = rollDie(n);
        client.say(target, `You rolled a ${num}`);
        return;
    } 
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
    }
}
exports.run = run;

function run(args, client, target, context, msg, self) {
    const num = rollDie(n);
    client.say(target, `You rolled a ${num}`);
}
exports.run = run;

function rollDie(n) {
    return Math.floor(Math.random() * n) + 1;
}
