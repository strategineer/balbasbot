const util = require("../util.js");
const fs = require('fs');
const moment = require("moment");

let startTime;
let endTime;

let intervalObj;


function setTimerText(text) {
  fs.writeFile("../data/timer.txt", text, function(err) {
      if(err) {
          return console.log(err);
      }
    console.log(`set timer text to ${text}`);
  });
}

function startTimer(p, durationInMinutes) {
  prefix = p;
  stopTimer();
  startTime = moment();
  endTime = moment().add(durationInMinutes, 'minutes');
  intervalObj = setInterval(() => {
    if (endTime < moment()) {
      stopTimer();
    } else {
      setTimerText(`${prefix} ${endTime.from(startTime)}`);
    }
  }, 5000);
}

function stopTimer() {
  clearInterval(intervalObj);
  setTimerText("");
  startTime = undefined;
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
      startTimer("", 15)
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
    console.log(`Starting countdown timer prefixed with ${givenPrefix} ${durationInMinutes}`);
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
