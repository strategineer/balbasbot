import mongoose = require('mongoose');
import tmi = require('tmi.js');
import util = require('./util');
import cmds = require('./commands');

const winston = require('winston');

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.json(),
  transports: [
    // TODO(keikakub): Log these files to sambashare to be able to read them from anywhere*
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console(),
  ],
});

import { BotError, UserError } from './error';
import { SubCommand } from './classes/sub-command';
import { CounterCommand } from './commands/counter-command';
import { RollCommand } from './commands/roll-command';
import { TestCommand } from './commands/test-command';
import { GetCommand } from './commands/get-command';
import { SetCommand } from './commands/set-command';
import { BannerCommand } from './commands/banner-command';
import { BrbCommand } from './commands/brb-command';
import { TeamCommand } from './commands/team-command';
import { HelpCommand } from './commands/help-command';
import { StreamCommand } from './commands/stream-command';

import { Tracker } from './tracker';

const tracker = new Tracker(logger);

// Connection URL
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'balbasbot';

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', function () {
  logger.error(`Mongo DB connection error for ${dbName}`);
});
db.once('open', function () {
  logger.info(`Connected successfully to server for db ${dbName}`);
  const client = new tmi.client(util.secretData.main);

  const commandInstancesList: SubCommand[] = [
    new RollCommand(logger, client),
    new CounterCommand(logger, client),
    new TestCommand(logger, client),
    new GetCommand(logger, client),
    new SetCommand(logger, client),
    new BannerCommand(logger, client),
    new BrbCommand(logger, client),
    new TeamCommand(logger, client),
    new HelpCommand(logger, client),
    new StreamCommand(logger, client),
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

  function handleErrorGracefully(e, target, context): void {
    let message;
    if (e instanceof UserError) {
      message = e.message;
    } else {
      message = 'Internal Error';
      throw e;
    }
    if (message) {
      respond(target, context, message);
      logger.info(`Responding with '${message}'`);
    }
    if (e.message) {
      logger.error(e.message);
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
      return;
    }

    if (!(commandName in commandInstancesDict)) {
      throw new BotError();
    }
    logger.info(`* Executing ${commandName} with args [${args}]`);
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
    logger.info(`* Connected to ${addr}:${port}`);
  });
  //const USERNAME_FORMAT_STRING = '{username}';
  client.on('join', (target, username, self) => {
    // TODO(keikakub): reimagine this feature to avoid bot spam
    // also,  making it so that we only say hi to a user once
    // Ignore self joins from the bot
    if (self) {
      return;
    }
    // Track self and everyone else to help detect bots
    tracker.trackByUsername(username, 'channelJoin');
    /*
    const atUser = `@${username}`;
    let joinMessage = util.pick(util.data.join.messages);
    if (joinMessage.includes(USERNAME_FORMAT_STRING)) {
      joinMessage = joinMessage.replace(USERNAME_FORMAT_STRING, atUser);
    } else {
      joinMessage = `${joinMessage} ${atUser}`;
    }
    // let's track these guys but don't say anything to them
    if (util.data.join.ignoreList.includes(username)) {
      return;
    }
    client.say(target, joinMessage);
    */
  });

  // Connect to Twitch:
  client.connect();
});
