const tmi = require('tmi.js');
const fs = require('fs');

const helpText = `
!pick
    Pick a random team
!pick team
    Pick a random team
!pick skill
    Pick a random skill from the GAPS skill categories
!pick skill GSM
    Pick a random skill from the GSM skill categories
!dice
    Roll a d6
`

// Define configuration options
const raw_secret_data = fs.readFileSync('secret/data.json');
const opts = JSON.parse(raw_secret_data);

const raw_data = fs.readFileSync('data.json');
const data = JSON.parse(raw_data);

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot
    if (!msg.startsWith('!')) { return; }


    // Remove whitespace from chat message
    const command = msg.substr(1, msg.length).trim();

    const args = command.split(' ');

    const commandName = args.shift();

    // If the command is known, let's execute it
    if (commandName === 'help') {
        client.say(target, helpText);
    } else if (commandName === 'dice') {
        const num = rollDice();
        client.say(target, `You rolled a ${num}`);
    } else if(commandName === 'pick') {
        const subCommand = args[0] ? args.shift() : ['team'];
        let picked = '';
        if (subCommand === 'skill') {
            const skillTypesFilter = args[0] ? args.filter(c => !(c in data.bloodBowl.skills.all)) : data.bloodBowl.skills.default;
            let skills = [];
            for (s of skillTypesFilter) {
                skills = skills.concat(data.bloodBowl.skills.byCategory[s]);
            }
            picked = pick(skills);
            client.say(target, `${picked}? (using ${skillTypesFilter})`);
        } else if (subCommand === 'team') {
            picked = pick(data.bloodBowl.teams);
            client.say(target, `${picked}?`);
        } else {
            console.log(`* Unknown !pick ${subCommand}`);
            return;
        }
    } else {
        console.log(`* Unknown command ${commandName}`);
        return
    }
    console.log(`* Executed ${commandName} command`);
}

function pick(ls) {
    const i = Math.floor(Math.random() * ls.length);
    return ls[i];
}

// Function called when the "dice" command is issued
function rollDice () {
    const sides = 6;
    return Math.floor(Math.random() * sides) + 1;
}
// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}
