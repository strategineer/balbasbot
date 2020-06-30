import util = require('../util');
import cmds = require('../commands');
import { UserError, BotError } from '../error';

export abstract class SubCommand {
  private _name: string;
  private lastUsedUsername: string;
  private _config;
  private _client;
  private _logger;
  public constructor(logger, client, name: string) {
    this._client = client;
    this._name = name;
    this._logger = logger.child({ command: this._name });
    this._config = util.getCommandByName(this.name);
  }
  public get logger() {
    return this._logger;
  }
  protected get client() {
    return this._client;
  }
  public get name(): string {
    return this._name;
  }
  protected get config() {
    return this._config;
  }

  public async run(args: string[], context?): Promise<string | null> {
    this.lastUsedUsername = context.username;
    await this._preRun(args, context);
    return new Promise(
      function (resolve, reject): void {
        this.logger.defaultMeta = {
          command: this._name,
          args: args,
          context: context,
        };
        this.logger.info(`Running command '${this._name}' with args [${args}]`);
        this._run(args, context, resolve, reject);
        this.logger.defaultMeta = {
          command: this._name,
        };
      }.bind(this)
    );
  }

  protected async _preRun(args: string[], context): Promise<void> {
    return;
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
