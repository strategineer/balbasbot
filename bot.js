const tmi = require("tmi.js");
const util = require("./util.js");
const cmds = require("./commands.js");
const database = require("./database.js");
const error = require("./error.js");

let commandFunctions = {};
for (c of util.data.commands.choices) {
  commandFunctions[c] = require(`./commands/${c}.js`);
}

database.init();

// Create a client with our options
const client = new tmi.client(util.opts);

// Register our event handlers (defined below)
client.on("message", (target, context, msg, self) => {
  if (self) {
    return;
  } // Ignore messages from the bot
  if (!msg.startsWith("!")) {
    return;
  }

  // Remove whitespace from chat message
  const command = msg.substr(1, msg.length).trim();

  const args = command.split(" ");

  const commandQuery = args.shift();

  const commandChoices = cmds.getCommandsForUser(context.username);

  const commandName = util.queryFrom(
    commandQuery,
    commandChoices,
    client,
    target
  );

  if (!(commandName in commandFunctions)) {
    console.log(`* Unknown command ${commandName}`);
    return;
  }
  try {
    console.log(`* Executing ${commandName} with args [${args}]`);
    commandFunctions[commandName].run(args, context, function (response) {
      if (response && typeof response == "string") {
        client.say(target, response);
      }
    });
  } catch (e) {
    let message;
    if (e instanceof error.UserError) {
      message = e.message;
    } else {
      message = "Internal Error";
    }
    if (message) {
      client.say(target, message);
      console.log(message);
    }
    if (e.message) {
      console.log(message);
    }
  }
});
client.on("connected", (addr, port) => {
  console.log(`* Connected to ${addr}:${port}`);
});
const USERNAME_FORMAT_STRING = "{username}";
let n_viewers = 0;
client.on("join", (target, username, self) => {
  if (self) {
    return;
  } // Ignore self joins from the bot
  if (util.data.join.ignoreList.includes(username)) {
    return;
  }
  n_viewers = n_viewers + 1;
  const atUser = `@${username}`;
  let joinMessage = util.pick(util.data.join.messages);
  if (joinMessage.includes(USERNAME_FORMAT_STRING)) {
    joinMessage = joinMessage.replace(USERNAME_FORMAT_STRING, atUser);
  } else {
    joinMessage = `${joinMessage} ${atUser}`;
  }
  client.say(target, joinMessage);
});
client.on("part", (target, username, self) => {
  if (self) {
    return;
  } // Ignore self joins from the bot
  if (util.data.join.ignoreList.includes(username)) {
    return;
  }
  n_viewers = n_viewers - 1;
});

// Connect to Twitch:
client.connect();
