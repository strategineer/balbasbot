import util = require('../util');
import cmds = require('../commands');

import { SubCommand } from '../classes/sub-command';

export class HelpCommand extends SubCommand {
  public constructor(logger, client) {
    super(logger, client, 'help');
  }
  protected _run(args, context, resolve, reject): void {
    if (!args[0]) {
      throw this.genericUsageError();
    }
    const commandChoices = cmds.getCommandsForUser(context.username);
    const subCommand = util.queryFrom(args[0], commandChoices);
    resolve(util.getCommandUsageHelp(subCommand));
  }
}
