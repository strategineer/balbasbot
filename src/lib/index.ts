import mongoose = require('mongoose');
import tmi = require('tmi.js');
import util = require('./util');

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

import { Tracker } from './tracker';
import { CommandExecutor } from './classes/command-executor';

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
  const commandExecutor = new CommandExecutor(logger, client);

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

    commandExecutor.tryExecute(msg, context, target);
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
