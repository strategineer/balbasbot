import util = require('../util');
import moment from 'moment';

import { SubCommand } from '../classes/sub-command';

export class TestCommand extends SubCommand {
  private uptimeStart: Date;
  public constructor(client) {
    super(client, 'test');
    this.uptimeStart = new Date();
  }
  protected _run(args, context, resolve, reject): void {
    if (!args[0]) {
      throw this.usageError();
    }
    const subCommand = util.queryFrom(args[0], this.config.commands);
    if (subCommand === 'uptime') {
      resolve(moment(this.uptimeStart).format());
      return;
    }
    reject(subCommand);
  }
}
