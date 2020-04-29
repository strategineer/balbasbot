import util = require('../util');
import cmds = require('../commands');

import { SubCommand } from '../classes/sub-command';

export class HelpCommand extends SubCommand {
  public constructor() {
    super('help');
  }
  protected async _run(args, context): Promise<string | null> {
    if (!args[0]) {
      throw this.genericUsageError();
    }
    const commandChoices = cmds.getCommandsForUser(context.username);
    const subCommand = util.queryFrom(args[0], commandChoices);
    return util.getCommandUsageHelp(subCommand);
  }
}
