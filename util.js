const fs = require('fs');

// Define configuration options
const raw_secret_data = fs.readFileSync('secret/data.json');
const opts = JSON.parse(raw_secret_data);
exports.opts = opts;


const raw_data = fs.readFileSync('data.json');
const data = JSON.parse(raw_data);
exports.data = data;


function queryFrom(query, choices, client, target, defaultChoice) {
    const filteredChoices = choices.filter(c => c.startsWith(query));
    let choice  = '';
    if (filteredChoices.length === 1) {
        choice = filteredChoices[0];
    } else {
        if (defaultChoice) {
            choice = defaultChoice;
        } else if (filteredChoices.length === 0) {
            client.say(target, `${query} not known. Try [${choices}]`);
            return;
        } else {
            client.say(target, `${query} is too vague, did you mean [${filteredChoices}]?`);
            return;
        }
    }
    return choice;
}
exports.queryFrom = queryFrom;
