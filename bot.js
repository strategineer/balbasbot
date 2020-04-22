const tmi = require('tmi.js');
const util = require('./util.js')

let commandFunctions = {}
for (c of util.data.commands.choices) {
    commandFunctions[c] = require(`./commands/${c}.js`);
}

// Create a client with our options
const client = new tmi.client(util.opts);

// Register our event handlers (defined below)
client.on('message', (target, context, msg, self) => {
    if (self) { return; } // Ignore messages from the bot
    if (!msg.startsWith('!')) { return; }

    // Remove whitespace from chat message
    const command = msg.substr(1, msg.length).trim();

    const args = command.split(' ');

    const commandQuery = args.shift();

    const commandName = util.queryFrom(commandQuery, util.data.commands.choices, client, target);
    
    // TODO(keikakub): implement queue command to get biggest viewers to add them to my blood bowl teams
    // TODO(keikakub): implement permissions checking before running commands (all, streamer, mod)
    if (commandName in commandFunctions) {
        commandFunctions[commandName].run(args, client, target, context, msg, self);
        console.log(`* Executed ${commandName} command`);
    } else {
        console.log(`* Unknown command ${commandName}`);
        return;
    }
});
client.on('connected', (addr, port) => {
    console.log(`* Connected to ${addr}:${port}`);
});
let n_viewers = 0
client.on("join", (target, username, self) => {
    if (self) { return; } // Ignore self joins from the bot
    if (username in util.data.join.ignoreList) { return; } // Ignore joins from streamer
    // TODO(keikakub): implement per viewer view/visit tracking to reward them for coming back frequently
    n_viewers = n_viewers + 1;
    const joinMessagePrefix = util.pick(util.data.join.messages);
    client.say(target, `${joinMessagePrefix} @${username}`);
});
client.on("part", (target, username, self) => {
    if (self) { return; } // Ignore self joins from the bot
    if (username in util.data.join.ignoreList) { return; } // Ignore joins from streamer
    n_viewers = n_viewers - 1;
});

// Connect to Twitch:
client.connect();
