const tmi = require("tmi.js");
const util = require("./util");
const cmds = require("./commands");
const database = require("./database");
const error = require("./error");
const tracker = require("./tracker");

const commandFunctions = {};
for (const c of util.data.commands.map((c) => c.name)) {
  commandFunctions[c] = require(`./commands/${c}`);
}

database.init();

// Create a client with our options
const client = new tmi.client(util.secretData.main);

function respond(target, context, msg) {
  switch (context["message-type"]) {
    case "chat":
      client.say(target, msg);
      return;
    case "whisper":
      // TODO(keikakub): this doens't work yet,s
      // client.whisper(context.username, msg);
      return;
  }
}

// Register our event handlers (defined below)
client.on("message", (target, context, msg, self) => {
  if (self) {
    return;
  } // Ignore messages from the bot
  if (!msg.startsWith("!")) {
    tracker.track(context.username, "messageSent");
    return;
  }
  tracker.track(context.username, "commandRan");

  // Remove whitespace from chat message
  const command = msg.substr(1, msg.length).trim();

  // TODO(keikakub): Add proper cmd line splitting here
  const args = command.split(" ");

  const commandQuery = args.shift();

  const commandChoices = cmds.getCommandsForUser(context.username);

  let commandName;
  try {
    commandName = util.queryFrom(commandQuery, commandChoices);

    if (!(commandName in commandFunctions)) {
      console.log(`* Unknown command ${commandName}`);
      return;
    }
    console.log(`* Executing ${commandName} with args [${args}]`);
    const commandConfig = util.getCommandByName(commandName);
    commandFunctions[commandName].run(commandConfig, args, context, function (
      response
    ) {
      if (response && typeof response == "string") {
        respond(target, context, response);
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
      respond(target, context, message);
    }
    if (e.message) {
      console.log(e.message);
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
  tracker.track(username, "channelJoin");
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
