import util = require('../util');
import assert = require('assert');

import { Alias } from '../models/alias';

import { SubCommand } from '../classes/sub-command';
import { CommandExecutor } from '../classes/command-executor';

export class AliasCommand extends SubCommand {
  private aliases;
  private commandExecutor: CommandExecutor;
  public constructor(logger, client, commandExecutor: CommandExecutor) {
    super(logger, client, 'alias');
    this.commandExecutor = commandExecutor;
  }

  protected async _preRun(args, context): Promise<void> {
    this.aliases = await Alias.find({});
  }

  protected _run(args, context, resolve, reject): void {
    const aliasIds = this.aliases.map((a) => {
      return a.id;
    });
    const fromAliasIdToAlias = this.aliases.reduce(
      (a, x) => ({ ...a, [x.id]: x }),
      {}
    );
    if (args.length === 0) {
      resolve(this.aliases.map((c) => c.toString()).join(', '));
      return;
    }
    const subCommand = util.queryFrom(
      args[0],
      this.config.commands.concat(aliasIds)
    );
    if (subCommand === 'update') {
      args.shift();
      const aliasId = args[0];
      args.shift();
      const aliasCommand = args.join(' ');
      args.shift();
      if (!aliasId) {
        throw this.userError(`Invalid alias id '${aliasId}'`);
      }
      if (!aliasCommand) {
        throw this.userError(`Invalid alias command '${aliasCommand}'`);
      }
      let alias;
      if (!(aliasId in fromAliasIdToAlias)) {
        alias = new Alias({ id: aliasId, command: aliasCommand });
      } else {
        alias = fromAliasIdToAlias[aliasId];
        alias.command = aliasCommand;
      }
      alias.save(function (err, result) {
        resolve(`${alias.toString()}`);
      });
      return;
    }
    if (subCommand === 'delete') {
      args.shift();
      if (!(args[0] in fromAliasIdToAlias)) {
        throw this.userError(`No alias with id ${args[0]} found`);
      }
      Alias.deleteOne(
        { id: args[0] },
        function (err): void {
          assert.equal(err, null);
          this.updateText();
          resolve();
        }.bind(this)
      );
      return;
    }
    if (subCommand in fromAliasIdToAlias) {
      args.shift();
      const alias = fromAliasIdToAlias[subCommand];
      this.commandExecutor.tryExecute(alias.command, context);
      return;
    }
    throw this.genericUsageError();
  }
}
