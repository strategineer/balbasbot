import util = require('../util');
import cmds = require('../commands');
import { UserError, BotError } from '../error';

export abstract class SubCommand {
  private _name: string;
  private lastUsedUsername: string;
  private _config;
  public constructor(name: string) {
    this._name = name;
    this._config = util.getCommandByName(this.name);
  }
  public get name(): string {
    return this._name;
  }
  protected get config() {
    return this._config;
  }

  public async run(args: string[], context?): Promise<string | null> {
    this.lastUsedUsername = context.username;
    const that = this;
    return new Promise(function (resolve, reject) {
      that._run(args, context, resolve, reject);
    });
  }
  protected abstract _run(
    args: string[],
    context,
    resolve: () => void,
    reject: () => void
  ): void;

  protected userError(msg: string): UserError {
    return new UserError(msg);
  }

  protected usageError(): UserError {
    return new UserError(util.getCommandUsageHelp(this.config.name));
  }

  protected genericUsageError(): UserError {
    const commandChoices = cmds.getCommandsForUser(this.lastUsedUsername);
    return new UserError(
      `Get help on specific commands by running '!help [${commandChoices}]'`
    );
  }

  protected botError(): BotError {
    return new BotError();
  }
}
