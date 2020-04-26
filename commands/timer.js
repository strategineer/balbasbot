const util = require("../util.js");
const fs = require("fs");
const moment = require("moment");
const path = require("path");

const appDir = path.dirname(require.main.filename);

let endTime;

let intervalObj;
let oldText;

function setTimerText(text) {
  if (oldText !== text) {
    fs.writeFile(`${appDir}/data/timer.txt`, text, function (err) {
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

function run(args, context, done) {
  let n;
  if (!args[0]) {
    if (endTime) {
      stopTimer();
      console.log("Stop timer");
      done();
      return;
    } else {
      startTimer("", 15);
      console.log("Starting default countdown timer");
      done();
      return;
    }
  }
  const defaultValue = args[0] ? undefined : "stop";
  const subCommand = util.queryFrom(
    args[0],
    util.data.commands.details["timer"].commands,
    defaultValue
  );
  if (subCommand === "start") {
    args.shift();
    const givenPrefix = args[0];
    const durationInMinutes = args[1];
    startTimer(givenPrefix, durationInMinutes);
    console.log(
      `Starting countdown timer prefixed with ${givenPrefix} ${durationInMinutes}`
    );
    done();
  } else if (subCommand === "stop") {
    stopTimer();
    console.log("Stop timer with stop");
    done();
  } else {
    throw new Error(`* Unknown !timer ${subCommand}`);
  }
}
exports.run = run;
