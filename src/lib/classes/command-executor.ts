import util = require('../util');
import cmds = require('../commands');

import { BotError, UserError } from '../error';

import { SubCommand } from './sub-command';
import { CounterCommand } from '../commands/counter-command';
import { RollCommand } from '../commands/roll-command';
import { TestCommand } from '../commands/test-command';
import { GetCommand } from '../commands/get-command';
import { SetCommand } from '../commands/set-command';
import { BannerCommand } from '../commands/banner-command';
import { BrbCommand } from '../commands/brb-command';
import { TeamCommand } from '../commands/team-command';
import { HelpCommand } from '../commands/help-command';
import { StreamCommand } from '../commands/stream-command';

export class CommandExecutor {
  private logger;
  private client;
  private commandInstancesList: SubCommand[];
  private commandInstancesDict: { [commandName: string]: SubCommand };
  public constructor(logger, client) {
    this.logger = logger.child({ className: 'CommandExecutor' });
    this.client = client;
    this.commandInstancesList = [
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

    this.commandInstancesDict = {};
    for (const c of this.commandInstancesList) {
      if (c.name in this.commandInstancesDict) {
        throw new BotError(
          `Duplicate command name ${c.name} found in command instances list.`
        );
      }
      this.commandInstancesDict[c.name] = c;
    }
    for (const c of util.data.commands.map((c) => c.name)) {
      if (!(c in this.commandInstancesDict)) {
        throw new BotError(
          `Command named '${c}' from data not found in command instances list.`
        );
      }
    }
  }
  public tryExecute(msg: string, target, context): void {
    const command = msg.substr(1, msg.length).trim();
    const args = util.splitArgs(command, '"');
    const commandQuery = args.shift();
    const commandChoices = cmds.getCommandsForUser(context.username);
    let commandName;
    try {
      commandName = util.queryFrom(commandQuery, commandChoices);
    } catch (e) {
      this.handleErrorGracefully(e, target, context);
      return;
    }
    if (!(commandName in this.commandInstancesDict)) {
      throw new BotError();
    }
    this.logger.info(`* Executing ${commandName} with args [${args}]`);
    this.commandInstancesDict[commandName]
      .run(args, context)
      .then((response) => {
        if (response && typeof response == 'string') {
          this.respond(target, context, response);
        }
      })
      .catch((err) => {
        this.handleErrorGracefully(err, target, context);
      });
  }

  private respond(target, context, msg: string): void {
    switch (context['message-type']) {
      case 'chat':
        this.client.say(target, msg);
        return;
      case 'whisper':
        // TODO(keikakub): this doesn't work yet
        // this.client.whisper(context.username, msg);
        return;
    }
  }

  private handleErrorGracefully(e, target, context): void {
    let message;
    if (e instanceof UserError) {
      message = e.message;
    } else {
      message = 'Internal Error';
      throw e;
    }
    if (message) {
      this.respond(target, context, message);
      this.logger.info(`Responding with '${message}'`);
    }
    if (e.message) {
      this.logger.error(e.message);
    }
  }
}
