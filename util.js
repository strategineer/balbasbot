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
  const filteredChoices = choices.filter((c) => c.startsWith(query));
  let choice = "";
  if (filteredChoices.length === 1) {
    return filteredChoices[0];
  }
  if (defaultChoice) {
    return defaultChoice;
  } else if (filteredChoices.length === 0) {
    throw `${query} not known. Try [${choices}]`;
  } else {
    throw `${query} is too vague, did you mean [${filteredChoices}]?`;
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
