import util = require('../util');

import { SubCommand } from '../classes/sub-command';

export class RollCommand extends SubCommand {
  public constructor(client) {
    super(client, 'roll');
  }
  protected _run(args, context, resolve, reject): void {
    let n;
    if (!args[0]) {
      n = 6;
    } else {
      n = parseInt(args[0], 10);
    }
    const count = args[1] ? parseInt(args[1], 10) : 1;
    if (!isNaN(n)) {
      let rolled;
      if (count === 1 || isNaN(count)) {
        rolled = this.die(n);
      } else {
        rolled = [...Array(count).keys()].map(() => this.die(n));
      }
      resolve(`You rolled ${rolled} on a d${n}`);
      return;
    }
    const defaultValue = args[0] ? undefined : 'team';
    const subCommand = util.queryFrom(
      args[0],
      this.config.commands,
      defaultValue
    );
    let rolled = '';
    if (subCommand === 'skill') {
      const allSkillCategories = this.config.data.skillCategories.map(
        (c) => c.code
      );
      const defaultSkillCategories = this.config.data.skillCategories
        .filter((c) => c.isRegular)
        .map((c) => c.code);

      args.shift();
      let chosenSkillCategories = [];
      if (!args[0]) {
        chosenSkillCategories = defaultSkillCategories;
      } else {
        for (const l of args) {
          chosenSkillCategories = chosenSkillCategories.concat([...l]);
        }
        chosenSkillCategories = chosenSkillCategories.map(function (x) {
          return x.toUpperCase();
        });
        chosenSkillCategories = chosenSkillCategories.filter((c) =>
          allSkillCategories.includes(c)
        );
      }
      if (chosenSkillCategories.length == 0) {
        throw this.userError(
          `Unknown skill category [${args}], try ${allSkillCategories}`
        );
      }
      const skills = this.config.data.skills
        .filter((s) => chosenSkillCategories.includes(s.category))
        .map((s) => s.name);
      rolled = util.pick(skills);
      resolve(`${rolled}? (using ${chosenSkillCategories})`);
    } else if (subCommand === 'list') {
      if (!args || args.length < 3) {
        throw this.userError(
          "Must have at least two items to select from. Try '!roll list A B C'"
        );
      }
      args.shift();
      rolled = util.pick(args);
      resolve(`${rolled}?`);
    } else {
      rolled = util.pick(this.config.data.teams);
      resolve(`${rolled}?`);
    }
  }
  private die(n: number): number {
    if (n < 0) {
      throw this.userError("You can't roll a negative number!");
    }
    return Math.floor(Math.random() * n) + 1;
  }
}
