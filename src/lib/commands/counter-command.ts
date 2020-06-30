import util = require('../util');
import assert = require('assert');
import path = require('path');
import fs = require('fs');

import { Counter } from '../models/counter';

import { SubCommand } from '../classes/sub-command';

export class CounterCommand extends SubCommand {
  private text: string;
  private pathToData: string;
  private counters;
  public constructor(logger, client) {
    super(logger, client, 'counter');
    this.pathToData = path.resolve(
      `${util.secretData.environment.counterBasePath}all.txt`
    );
    Counter.find({}).exec(
      function (err, counters): void {
        if (!err) {
          this.counters = counters;
          this.updateText();
        }
      }.bind(this)
    );
  }

  private updateText(): void {
    let newText = '';
    for (const c of this.counters
      .filter((ca) => ca.order >= 0)
      .sort((c1, c2) => c1.order - c2.order)) {
      newText += `${c.displayName}: ${c.value}\n`;
    }
    if (this.text !== newText) {
      fs.writeFile(this.pathToData, newText, function (err): void {
        if (err) {
          this.logger.error(err);
          return;
        }
      });
    }
  }
  protected async _preRun(args, context): Promise<void> {
    this.counters = await Counter.find({});
  }

  protected _run(args, context, resolve, reject): void {
    const counterIds = this.counters.map((t) => {
      return t.id;
    });
    const fromCounterIdToCounter = this.counters.reduce(
      (a, x) => ({ ...a, [x.id]: x }),
      {}
    );
    if (args.length === 0) {
      resolve(this.counters.map((c) => c.toString()).join(', '));
      return;
    }
    const subCommand = util.queryFrom(
      args[0],
      this.config.commands.concat(counterIds)
    );
    if (subCommand === 'create') {
      args.shift();
      const counterId = args[0].trim();
      args.shift();
      const displayName = args[0].trim();
      args.shift();
      if (!counterId) {
        throw this.userError(`Invalid counter id '${counterId}'`);
      }
      if (counterId in fromCounterIdToCounter) {
        throw this.userError(`Counter id '${counterId}' already exists`);
      }
      const counterData = {
        id: counterId,
        value: 0,
        displayName: displayName,
      };
      if (args && args.length > 0) {
        const initialValueParsed = parseInt(args[0]);
        if (!isNaN(initialValueParsed) && initialValueParsed > 0) {
          counterData['initialValue'] = initialValueParsed;
          counterData['value'] = initialValueParsed;
        }
        args.shift();
      }
      if (args && args.length > 0) {
        counterData['isCountingDown'] = args[0] === 'dec';
        args.shift();
      }
      if (!counterId) {
        throw this.userError(`Invalid counter id '${counterId}'`);
      }
      const counter = new Counter(counterData);
      counter.save(function (err, result) {
        resolve(`Created counter ${counter.id}: ${counter.toString()}`);
      });
      return;
    }
    if (subCommand === 'delete') {
      args.shift();
      if (!(args[0] in fromCounterIdToCounter)) {
        throw this.userError(`No counter with id ${args[0]} found`);
      }
      Counter.deleteOne(
        { id: args[0] },
        function (err): void {
          assert.equal(err, null);
          this.updateText();
          resolve();
        }.bind(this)
      );
      return;
    }
    if (subCommand === 'reset') {
      args.shift();
      if (!args.every((a) => a in fromCounterIdToCounter)) {
        throw this.userError(
          `All given counter ids must exist [${counterIds.join(', ')}]`
        );
      }
      for (const a of args) {
        const counter = fromCounterIdToCounter[a];
        counter.value = counter.initialValue;
        counter.save(
          function (err): void {
            assert.equal(err, null);
            // TODO(strategineer):hack
            if (a === args[args.length - 1]) {
              this.updateText();
              resolve();
            }
          }.bind(this)
        );
      }
      return;
    }
    if (subCommand === 'show') {
      args.shift();
      if (!args.every((a) => a in fromCounterIdToCounter)) {
        throw this.userError(
          `All given counter ids must exist [${counterIds.join(', ')}]`
        );
      }
      for (const id of counterIds) {
        const counter = fromCounterIdToCounter[id];
        counter.order = args.indexOf(id);
        counter.save(
          function (err): void {
            assert.equal(err, null);
            // TODO(strategineer):hack
            if (id === counterIds[counterIds.length - 1]) {
              this.updateText();
              resolve();
            }
          }.bind(this)
        );
      }
      return;
    }
    if (subCommand in fromCounterIdToCounter) {
      args.shift();
      let valueToSet = undefined;
      if (args && args.length > 0) {
        const valueParsed = parseInt(args[0]);
        if (!isNaN(valueParsed) && valueParsed > 0) {
          valueToSet = valueParsed;
        }
        args.shift();
      }
      const counter = fromCounterIdToCounter[subCommand];
      if (valueToSet !== undefined) {
        counter.value = valueToSet;
      } else {
        counter.value += counter.isCountingDown ? -1 : 1;
      }
      counter.value = Math.max(counter.value, 0);
      counter.save(
        function (err): void {
          assert.equal(err, null);
          this.updateText();
          resolve(counter.toString());
        }.bind(this)
      );
      return;
    }
    throw this.genericUsageError();
  }
}
