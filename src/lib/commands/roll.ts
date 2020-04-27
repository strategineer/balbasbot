import util = require("../util");
import error = require("../error");

export function run(config, args, context, done) {
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
      rolled = die(n);
    } else {
      rolled = [...Array(count).keys()].map((i) => die(n));
    }
    done(`You rolled ${rolled} on a d${n}`);
    return;
  }
  const defaultValue = args[0] ? undefined : "team";
  const subCommand = util.queryFrom(args[0], config.commands, defaultValue);
  let rolled = "";
  if (subCommand === "skill") {
    const allSkillCategories = config.data.skillCategories.map((c) => c.code);
    const defaultSkillCategories = config.data.skillCategories
      .filter((c) => c.isRegular)
      .map((c) => c.code);

    args.shift();
    let chosenSkillCategories = [];
    if (!args[0]) {
      chosenSkillCategories = defaultSkillCategories;
    } else {
      for (var l of args) {
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
      throw new error.UserError(
        `Unknown skill category [${args}], try ${allSkillCategories}`
      );
    }
    let skills = config.data.skills
      .filter((s) => chosenSkillCategories.includes(s.category))
      .map((s) => s.name);
    rolled = util.pick(skills);
    done(`${rolled}? (using ${chosenSkillCategories})`);
  } else if (subCommand === "list") {
    if (!args || args.length < 3) {
      throw new error.UserError(
        "Must have at least two items to select from. Try '!roll list A B C'"
      );
    }
    args.shift();
    rolled = util.pick(args);
    done(`${rolled}?`);
  } else {
    rolled = util.pick(config.data.teams);
    done(`${rolled}?`);
  }
}

export function die(n) {
  if (n < 0) {
    throw new error.UserError("You can't roll a negative number!");
  }
  return Math.floor(Math.random() * n) + 1;
}
