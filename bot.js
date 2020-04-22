const tmi = require('tmi.js');
const util = require('./util.js')

let commandFunctions = {}
for (c of util.data.commands.choices) {
    commandFunctions[c] = require(`./commands/${c}.js`);
}

// Create a client with our options
const client = new tmi.client(util.opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

const commands = util.data.commands.choices;

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot
    if (!msg.startsWith('!')) { return; }

    // Remove whitespace from chat message
    const command = msg.substr(1, msg.length).trim();

    const args = command.split(' ');

    const commandQuery = args.shift();

    const commandName = util.queryFrom(commandQuery, commands, client, target);
    
    if (commandName in commandFunctions) {
        commandFunctions[commandName].run(args, client, target, context, msg, self);
        console.log(`* Executed ${commandName} command`);
    } else {
        console.log(`* Unknown command ${commandName}`);
        return;
    }
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
}
