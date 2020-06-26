import fs = require('fs');
import path = require('path');

import util = require('../util');

import { SubCommand } from '../classes/sub-command';

const pathToData = path.resolve(util.secretData.environment.deathPath);

export class DeathCommand extends SubCommand {
  private deathCount: number;
  public constructor(logger, client) {
    super(logger, client, 'death');
    const savedNumber = parseInt(fs.readFileSync(pathToData, 'utf8'));
    if (isNaN(savedNumber) || savedNumber < 0) {
      this.setDeathCounter(0);
    } else {
      this.setDeathCounter(savedNumber);
    }
  }

  protected _run(args, context, resolve, reject): void {
    let newDeathCount: number;
    if (!args[0]) {
      newDeathCount = this.deathCount + 1;
    } else {
      const deathCountParsed = parseInt(args[0]);
      if (isNaN(deathCountParsed) || deathCountParsed < 0) {
        throw this.userError(
          `Death count '${deathCountParsed}' must be specified as a positive number`
        );
      }
      newDeathCount = deathCountParsed;
    }
    this.setDeathCounter(newDeathCount, resolve);
  }
  private setDeathCounter(newCount, resolve = undefined): void {
    // TODO(keikakub): This duplicated code-ish, check setTimerText in timer-command.ts
    if (this.deathCount !== newCount) {
      fs.writeFile(
        pathToData,
        newCount.toString(),
        function (err): void {
          if (err) {
            this.logger.error(err);
            return;
          }
          this.logger.info(`set death count to '${newCount.toString()}'`);
          this.deathCount = newCount;
          if (resolve !== undefined) {
            resolve(`Death count set to ${this.deathCount}`);
          }
        }.bind(this)
      );
    }
  }
}
