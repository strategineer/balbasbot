const util = require("../util.js");

function run(args, context) {
  let n;
  if (!args[0]) {
    n = 6;
  } else {
    n = parseInt(args[0], 10);
  }
  if (!isNaN(n)) {
    const rolled = die(n);
    return `You rolled a ${rolled} on a d${n}`;
  }
  const defaultValue = args[0] ? undefined : "team";
  const subCommand = util.queryFrom(
    args[0],
    util.data.commands.details["roll"].commands,
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
      throw new Error(
        `Unknown skill category [${args}], try ${util.data.bloodBowl.skills.all}`
      );
    }
    let skills = [];
    for (s of chosenSkillTypes) {
      skills = skills.concat(util.data.bloodBowl.skills.byCategory[s]);
    }
    rolled = util.pick(skills);
    return `${rolled}? (using ${chosenSkillTypes})`;
  } else if (subCommand === "team") {
    rolled = util.pick(util.data.bloodBowl.teams);
    return `${rolled}?`;
  } else {
    throw new Error(`* Unknown !roll ${subCommand}`);
  }
}
exports.run = run;

function die(n) {
  if (n < 0) {
    throw new Error("You can't roll a negative number!");
  }
  return Math.floor(Math.random() * n) + 1;
}
exports.die = die;
