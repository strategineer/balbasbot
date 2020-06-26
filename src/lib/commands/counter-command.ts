import fs = require('fs');
import path = require('path');

import util = require('../util');

import { SubCommand } from '../classes/sub-command';

export class CounterCommand extends SubCommand {
  private count: number;
  private pathToData: string;
  private titlePrefix: string;
  public constructor(logger, client, name, titlePrefix) {
    super(logger, client, name);
    this.titlePrefix = titlePrefix;
    this.pathToData = path.resolve(
      `${util.secretData.environment.counterBasePath}${name}.txt`
    );
    try {
      const savedData = fs.readFileSync(this.pathToData, 'utf8');
      const chunks = savedData.split(' ');
      if (chunks.length > 0) {
        const savedNumber = parseInt(chunks[chunks.length - 1]);
        if (!isNaN(savedNumber) && savedNumber > 0) {
          this.setCounter(savedNumber);
          return;
        }
      }
    } catch (err) {
      this.logger.error(err);
    }
    this.setCounter(0);
  }

  protected _run(args, context, resolve, reject): void {
    let newCount: number;
    if (!args[0]) {
      newCount = this.count + 1;
    } else {
      const countParsed = parseInt(args[0]);
      if (isNaN(countParsed) || countParsed < 0) {
        throw this.userError(
          `${this.name} count '${countParsed}' must be specified as a positive number`
        );
      }
      newCount = countParsed;
    }
    this.setCounter(newCount, resolve);
  }
  private setCounter(newCount, resolve = undefined): void {
    // TODO(keikakub): This duplicated code-ish, check setTimerText in timer-command.ts
    if (this.count !== newCount) {
      fs.writeFile(
        this.pathToData,
        `${this.titlePrefix} ${newCount.toString()}`,
        function (err): void {
          if (err) {
            this.logger.error(err);
            return;
          }
          this.logger.info(
            `set ${this.name} count to '${newCount.toString()}'`
          );
          this.count = newCount;
          if (resolve !== undefined) {
            resolve(`${this.name} count set to ${this.count}`);
          }
        }.bind(this)
      );
    }
  }
}
