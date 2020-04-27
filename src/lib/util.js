const fs = require("fs");
const error = require("./error.js");
const cmds = require("./commands.js");

// Define configuration options
const raw_secret_data = fs.readFileSync("config/secret/data.json");
const secretData = JSON.parse(raw_secret_data);
exports.secretData = secretData;

const raw_data = fs.readFileSync("config/data.json");
const data = JSON.parse(raw_data);
exports.data = data;

function getCommandUsageHelp(name) {
  let res = [];
  for (h of getCommandByName(name).help) {
    let str = `${name} ${h.example}`;
    if (h.description) {
      str += `: ${h.description}`;
    }
    res.push(str);
  }
  return res.join(" --- ");
}
exports.getCommandUsageHelp = getCommandUsageHelp;

function getCommandByName(name) {
  return data.commands.find((c) => c.name === name);
}
exports.getCommandByName = getCommandByName;

function queryFrom(query, choices, defaultChoice) {
  query = query ? query.trim() : query;
  if (!query && defaultChoice) {
    return defaultChoice;
  }
  if (!choices || choices.length === 0) {
    throw new error.BotError();
  }
  const filteredChoices = choices.filter((c) =>
    c.startsWith(query.toLowerCase())
  );
  if (filteredChoices.length === 1) {
    return filteredChoices[0];
  } else if (filteredChoices.length > 1) {
    throw new error.UserError(
      `${query} is too vague, did you mean [${filteredChoices}]?`
    );
  } else {
    throw new error.UserError(`${query} not known. Try [${choices}]`);
  }
}
exports.queryFrom = queryFrom;

// Function that returns a random element from the given list
function pick(ls) {
  if (ls && ls.length > 0) {
    const i = Math.floor(Math.random() * ls.length);
    return ls[i];
  }
  throw new error.BotError();
}
exports.pick = pick;

function throwUsageUserError(commandName) {
  throw new error.UserError(getCommandUsageHelp(commandName));
}
exports.throwUsageUserError = throwUsageUserError;

function throwDefaultUserError(username) {
  const commandChoices = cmds.getCommandsForUser(username);
  throw new error.UserError(
    `Get help on specific commands by running '!help [${commandChoices}]'`
  );
}
exports.throwDefaultUserError = throwDefaultUserError;
