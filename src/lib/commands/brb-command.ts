import fs = require('fs');
import path = require('path');

import moment = require('moment');
import util = require('../util');

import { SubCommand } from '../classes/sub-command';

export class BrbCommand extends SubCommand {
  private prefix;
  private endTime;

  private intervalObj;
  private oldText: string;
  public constructor(client) {
    super(client, 'brb');
  }

  protected _run(args, context, resolve, reject): void {
    let givenPrefix = this.config.data.prefix;
    let durationInMinutes = this.config.data.durationInMinutes;
    if (!args[0]) {
      if (this.isTimerRunning()) {
        this.stopTimer();
        console.log('Stopped current timer');
      } else {
        this.startTimer(givenPrefix, durationInMinutes);
        console.log('Starting default countdown timer');
      }
      resolve();
      return;
    }
    const firstArgumentParsedAsInt = parseInt(args[0]);
    if (isNaN(firstArgumentParsedAsInt)) {
      givenPrefix = args.slice(0, args.length - 1).join(' ');
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
    this.startTimer(givenPrefix, durationInMinutes);
    console.log(
      `Starting countdown timer for ${durationInMinutes} prefixed with ${givenPrefix}`
    );
    resolve();
  }

  private isTimerRunning(): boolean {
    return this.endTime;
  }

  private setTimerText(text: string): void {
    if (this.oldText !== text) {
      fs.writeFile(
        path.resolve(util.secretData.environment.timerPath),
        text,
        function (err): void {
          if (err) {
            return console.log(err);
          }
          console.log(`set timer text to '${text}'`);
          this.oldText = text;
        }.bind(this)
      );
    }
  }

  private getText(): string {
    return `${this.prefix} ${this.endTime.from(moment())}`;
  }

  private startTimer(prefix: string, durationInMinutes: number): void {
    this.prefix = prefix;
    this.stopTimer();
    this.endTime = moment().add(durationInMinutes, 'minutes');
    this.setTimerText(this.getText());
    this.intervalObj = setInterval(() => {
      if (this.endTime < moment()) {
        this.stopTimer();
      } else {
        this.setTimerText(this.getText());
      }
    }, 1000);
  }

  private stopTimer(): void {
    clearInterval(this.intervalObj);
    this.setTimerText('');
    this.endTime = undefined;
  }
}
