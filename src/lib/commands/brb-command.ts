import moment = require('moment');
import util = require('../util');

import { SubCommand } from '../classes/sub-command';
import { SharedFile } from '../classes/shared-file';
import { Timer } from '../classes/timer';

export class BrbCommand extends SubCommand {
  private prefix: string;
  private sharedFile: SharedFile;
  private timer: Timer;
  public constructor(logger, client) {
    super(logger, client, 'brb');
    this.sharedFile = new SharedFile(
      logger,
      util.secretData.environment.timerPath
    );
    this.timer = new Timer(
      logger,
      1000,
      function (t): void {
        this.sharedFile.setText(`${this.prefix} ${t.endTime.from(moment())}`);
      }.bind(this),
      function (t): void {
        this.sharedFile.setText('');
      }.bind(this)
    );
  }

  protected _run(args, context, resolve, reject): void {
    this.prefix = this.config.data.prefix;
    let durationInMinutes = this.config.data.durationInMinutes;
    if (!args[0]) {
      if (this.timer.isRunning) {
        this.timer.stop();
        this.logger.info('Stopped current timer');
      } else {
        this.timer.start(durationInMinutes * 60);
        this.logger.info('Starting default countdown timer');
      }
      resolve();
      return;
    }
    const firstArgumentParsedAsInt = parseInt(args[0]);
    if (isNaN(firstArgumentParsedAsInt)) {
      this.prefix = args.slice(0, args.length - 1).join(' ');
      const durationInMinutesString = args[args.length - 1];
      durationInMinutes = parseInt(durationInMinutesString);
      if (isNaN(durationInMinutes) || durationInMinutes < 0) {
        throw this.userError(
          `Duration in minutes '${durationInMinutesString}' must be specified as a positive number`
        );
      }
    } else {
      durationInMinutes = firstArgumentParsedAsInt;
    }
    this.timer.start(durationInMinutes * 60);
    this.logger.info(
      `Starting countdown timer for ${durationInMinutes} prefixed with ${this.prefix}`
    );
    resolve();
  }
}
