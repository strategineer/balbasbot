const util = require("../util.js");
const error = require("../error.js");

function run(config, args, context, done) {
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
  const subCommand = util.queryFrom(
    args[0],
    config.commands,
    defaultValue
  );
  let rolled = "";
  if (subCommand === "skill") {
    args.shift();
    let chosenSkillTypes = [];
    if (!args[0]) {
      chosenSkillTypes = util.data.bloodBowl.skills.default;
    } else {
      for (l of args) {
        chosenSkillTypes = chosenSkillTypes.concat([...l]);
      }
      chosenSkillTypes = chosenSkillTypes.map(function (x) {
        return x.toUpperCase();
      });
      chosenSkillTypes = chosenSkillTypes.filter((c) =>
        util.data.bloodBowl.skills.all.includes(c)
      );
    }
    if (chosenSkillTypes.length == 0) {
      throw new error.UserError(
        `Unknown skill category [${args}], try ${util.data.bloodBowl.skills.all}`
      );
    }
    let skills = [];
    for (s of chosenSkillTypes) {
      skills = skills.concat(util.data.bloodBowl.skills.byCategory[s]);
    }
    rolled = util.pick(skills);
    done(`${rolled}? (using ${chosenSkillTypes})`);
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
    rolled = util.pick(util.data.bloodBowl.teams);
    done(`${rolled}?`);
  }
}
exports.run = run;

function die(n) {
  if (n < 0) {
    throw new error.UserError("You can't roll a negative number!");
  }
  return Math.floor(Math.random() * n) + 1;
}
exports.die = die;
