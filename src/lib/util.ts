import { UserError, BotError } from './error';

export const secretData = require('../config/secret/data.json');
export const data = require('../config/data.json');

export function getCommandByName(name: string) {
  return data.commands.find((c) => c.name === name);
}

export function getCommandUsageHelp(name: string): string {
  const res = [];
  for (const h of getCommandByName(name).help) {
    let str = `${name} ${h.example}`;
    if (h.description) {
      str += `: ${h.description}`;
    }
    res.push(str);
  }
  return res.join(' --- ');
}

export function queryFrom(
  query: string,
  choices: string[],
  defaultChoice = undefined
): string {
  query = query ? query.trim() : '';
  if (!query && defaultChoice) {
    return defaultChoice;
  }
  if (!choices || choices.length === 0) {
    throw new BotError();
  }
  const filteredChoices = choices.filter((c) =>
    c.startsWith(query.toLowerCase())
  );
  if (filteredChoices.length === 1) {
    return filteredChoices[0];
  } else if (filteredChoices.length > 1) {
    throw new UserError(
      `'${query}' is too vague, did you mean [${filteredChoices}]?`
    );
  } else {
    throw new UserError(`'${query}' not known. Try [${choices}]`);
  }
}

// Function that returns a random element from the given list
export function pick<T>(ls: T[]): T {
  if (ls && ls.length > 0) {
    const i = Math.floor(Math.random() * ls.length);
    return ls[i];
  }
  throw new BotError();
}

/**
 * Randomly shuffle an array
 * https://stackoverflow.com/a/2450976/1293256
 * @param  {Array} array The array to shuffle
 * @return {String}      The first item in the shuffled array
 */
export function shuffle<T>(ls: T[]): T[] {
  if (!ls || ls.length === 0) {
    throw new BotError();
  }
  let currentIndex = ls.length;
  let temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = ls[currentIndex];
    ls[currentIndex] = ls[randomIndex];
    ls[randomIndex] = temporaryValue;
  }
  return ls;
}
