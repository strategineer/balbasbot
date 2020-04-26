const fs = require("fs");
const error = require("./error.js");

// Define configuration options
const raw_secret_data = fs.readFileSync("secret/data.json");
const opts = JSON.parse(raw_secret_data);
exports.opts = opts;

const raw_data = fs.readFileSync("data.json");
const data = JSON.parse(raw_data);
exports.data = data;

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
