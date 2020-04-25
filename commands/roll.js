const util = require('../util.js')

function run(args, context) {
    let n;
    if(!args[0]) {
        n = 6;
    } else {
        n = parseInt(args[0], 10);
    }
    if (!isNaN(n)) { 
        const rolled = rollDie(n);
        return `You rolled a ${rolled} on a d${n}`;
    } 
    const defaultValue = args[0] ? undefined : 'team';
    const subCommand = util.queryFrom(args[0], util.data.commands.details['roll'].commands, defaultValue);
    let rolled = '';
    if (subCommand === 'skill') {
        args.shift();
        const skillTypesFilter = args[0] ? args.filter(c => !(c in util.data.bloodBowl.skills.all)) : util.data.bloodBowl.skills.default;
        let skills = [];
        for (s of skillTypesFilter) {
            skills = skills.concat(util.data.bloodBowl.skills.byCategory[s]);
        }
        rolled = util.pick(skills);
        return `${rolled}? (using ${skillTypesFilter})`;
    } else if (subCommand === 'team') {
        rolled = util.pick(util.data.bloodBowl.teams);
        return `${rolled}?`;
    } else {
        throw `* Unknown !roll ${subCommand}`;
    }
}
exports.run = run;

function rollDie(n) {
    return Math.floor(Math.random() * n) + 1;
}
