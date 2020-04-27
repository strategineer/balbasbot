const util = require("../util.js");
const fs = require("fs");
const moment = require("moment");
const path = require("path");
const error = require("../error.js");

util.getCommandByName("brb").commands;

const appDir = path.dirname(require.main.filename);

let endTime;

let intervalObj;
let oldText;

function isTimerRunning() {
  return endTime;
}

function setTimerText(text) {
  if (oldText !== text) {
    fs.writeFile(`${appDir}/../data/timer.txt`, text, function (err) {
      if (err) {
        return console.log(err);
      }
      console.log(`set timer text to '${text}'`);
      oldText = text;
    });
  }
}

function getText() {
  return `${prefix} ${endTime.from(moment())}`;
}

function startTimer(p, durationInMinutes) {
  prefix = p;
  stopTimer();
  endTime = moment().add(durationInMinutes, "minutes");
  setTimerText(getText());
  intervalObj = setInterval(() => {
    if (endTime < moment()) {
      stopTimer();
    } else {
      setTimerText(getText());
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(intervalObj);
  setTimerText("");
  endTime = undefined;
}

function run(config, args, context, done) {
  let givenPrefix = config.defaults.prefix;
  let durationInMinutes = config.defaults.durationInMinutes;
  if (!args[0]) {
    if (isTimerRunning()) {
      stopTimer();
      console.log("Stopped current timer");
      return;
    } else {
      startTimer(givenPrefix, durationInMinutes);
      console.log("Starting default countdown timer");
      return;
    }
  }
  const firstArgumentParsedAsInt = parseInt(args[0]);
  if (isNaN(firstArgumentParsedAsInt)) {
    givenPrefix = args[0];
    durationInMinutes = parseInt(args[1]);
    if (isNaN(durationInMinutes) || durationInMinutes < 0) {
      throw new error.UserError(
        `Duration in minutes '${args[1]}' must be specified as a positive number`
      );
    }
  } else {
    durationInMinutes = firstArgumentParsedAsInt;
  }
  startTimer(givenPrefix, durationInMinutes);
  console.log(
    `Starting countdown timer for ${durationInMinutes} prefixed with ${givenPrefix}`
  );
}
exports.run = run;
