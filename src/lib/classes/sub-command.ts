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
  public run(args: string[], context?): string | Error {
    this.lastUsedUsername = context.username;
    this._run(args, context).then(
      (response) => {
        return response;
      },
      (reason) => {
        return reason;
      }
    );
  }
  protected abstract async _run(
    args: string[],
    context
  ): Promise<string | null>;

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
