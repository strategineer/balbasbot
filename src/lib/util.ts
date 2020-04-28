import fs = require('fs');
import error = require('./error');
import cmds = require('./commands');

export const secretData = require('../config/secret/data.json');
export const data = require('../config/data.json');

export function getCommandUsageHelp(name) {
  let res = [];
  for (var h of getCommandByName(name).help) {
    let str = `${name} ${h.example}`;
    if (h.description) {
      str += `: ${h.description}`;
    }
    res.push(str);
  }
  return res.join(' --- ');
}

export function getCommandByName(name) {
  return data.commands.find((c) => c.name === name);
}

export function queryFrom(
  query: string,
  choices: string[],
  defaultChoice = undefined
) {
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

// Function that returns a random element from the given list
export function pick(ls) {
  if (ls && ls.length > 0) {
    const i = Math.floor(Math.random() * ls.length);
    return ls[i];
  }
  throw new error.BotError();
}

export function throwUsageUserError(commandName) {
  throw new error.UserError(getCommandUsageHelp(commandName));
}

export function throwDefaultUserError(username) {
  const commandChoices = cmds.getCommandsForUser(username);
  throw new error.UserError(
    `Get help on specific commands by running '!help [${commandChoices}]'`
  );
}
