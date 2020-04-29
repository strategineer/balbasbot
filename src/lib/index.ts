import mongoose = require('mongoose');
import tmi = require('tmi.js');
import util = require('./util');
import cmds = require('./commands');
import tracker = require('./tracker');

import { BotError, UserError } from './error';
import { SubCommand } from './classes/sub-command';
import { RollCommand } from './commands/roll';
import { GetCommand } from './commands/get';
import { SetCommand } from './commands/set';
import { BannerCommand } from './commands/banner';
import { BrbCommand } from './commands/brb';
import { TeamCommand } from './commands/team';
import { HelpCommand } from './commands/help';

// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'balbasbot';

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log(`Connected successfully to server for db ${dbName}`);

  const commandInstancesList: SubCommand[] = [
    new RollCommand(),
    new GetCommand(),
    new SetCommand(),
    new BannerCommand(),
    new BrbCommand(),
    new TeamCommand(),
    new HelpCommand(),
  ];

  const commandInstancesDict = {};
  for (const c of commandInstancesList) {
    if (c.name in commandInstancesDict) {
      throw new BotError(
        `Duplicate command name ${c.name} found in command instances list.`
      );
    }
    commandInstancesDict[c.name] = c;
  }
  for (const c of util.data.commands.map((c) => c.name)) {
    if (!(c in commandInstancesDict)) {
      throw new BotError(
        `Command named '${c}' from data not found in command instances list.`
      );
    }
  }

  // Create a client with our options
  const client = new tmi.client(util.secretData.main);

  function respond(target, context, msg: string): void {
    switch (context['message-type']) {
      case 'chat':
        client.say(target, msg);
        return;
      case 'whisper':
        // TODO(keikakub): this doesn't work yet
        // client.whisper(context.username, msg);
        return;
    }
  }

  function handleErrorGracefully(e, target, context) {
    let message;
    if (e instanceof UserError) {
      message = e.message;
    } else {
      message = 'Internal Error';
    }
    if (message) {
      respond(target, context, message);
    }
    if (e.message) {
      console.log(e.message);
    }
  }

  // Register our event handlers (defined below)
  client.on('message', (target, context, msg, self) => {
    if (self) {
      return;
    } // Ignore messages from the bot
    if (!msg.startsWith('!')) {
      tracker.track(context, 'messageSent');
      return;
    }
    tracker.track(context, 'commandRan');

    // Remove whitespace from chat message
    const command = msg.substr(1, msg.length).trim();

    // TODO(keikakub): Add proper cmd line splitting here
    const args = command.split(' ');

    const commandQuery = args.shift();

    const commandChoices = cmds.getCommandsForUser(context.username);

    let commandName;
    try {
      commandName = util.queryFrom(commandQuery, commandChoices);
    } catch (e) {
      handleErrorGracefully(e, target, context);
    }

    if (!(commandName in commandInstancesDict)) {
      console.log(`* Unknown command ${commandName}`);
      return;
    }
    console.log(`* Executing ${commandName} with args [${args}]`);
    commandInstancesDict[commandName]
      .run(args, context)
      .then((response) => {
        if (response && typeof response == 'string') {
          respond(target, context, response);
        }
      })
      .catch((err) => {
        handleErrorGracefully(err, target, context);
      });
  });
  client.on('connected', (addr, port) => {
    console.log(`* Connected to ${addr}:${port}`);
  });
  const USERNAME_FORMAT_STRING = '{username}';
  client.on('join', (target, username, self) => {
    // Ignore self joins from the bot
    if (self) {
      return;
    }
    // Track self and everyone else to help detect bots
    tracker.trackByUsername(username, 'channelJoin');
    if (util.data.join.ignoreList.includes(username)) {
      return;
    }
    const atUser = `@${username}`;
    let joinMessage = util.pick(util.data.join.messages);
    if (joinMessage.includes(USERNAME_FORMAT_STRING)) {
      joinMessage = joinMessage.replace(USERNAME_FORMAT_STRING, atUser);
    } else {
      joinMessage = `${joinMessage} ${atUser}`;
    }
    client.say(target, joinMessage);
  });
  client.on('part', (target, username, self) => {
    if (self) {
      return;
    } // Ignore self joins from the bot
    if (util.data.join.ignoreList.includes(username)) {
      return;
    }
  });

  // Connect to Twitch:
  client.connect();
});
