const util = require("../util.js");
const database = require("../database.js");
const moment = require("moment");
const assert = require("assert");
const error = require("../error.js");

function updateStats(done, delta_wins, delta_draws, delta_losses) {
  database.run("teams", function (db, collection) {
    collection.updateOne(
      { retired_on: null },
      { $inc: { wins: delta_wins, draws: delta_draws, losses: delta_losses } },
      function (err, result) {
        assert.equal(err, null);
        console.log("Updated the current team");
        done(result);
      }
    );
  });
}

function showStats(done) {
  database.run("teams", function (db, collection) {
    collection.find({ retired_on: null }).toArray(function (err, teams) {
      assert.equal(err, null);
      if (teams.length === 0) {
        done(
          "No active team found, please create a new one with '!team create [NAME]'"
        );
      }
      done(
        teams
          .map((t) => {
            return formatTeam(t);
          })
          .join(", ")
      );
    });
  });
}

function retireTeam(done) {
  database.run("teams", function (db, collection) {
    collection.updateOne(
      { retired_on: null },
      { $set: { retired_on: moment() } },
      function (err, result) {
        assert.equal(err, null);
        console.log("Updated the current team");
        done(result);
      }
    );
  });
}

function showAllTeams(done) {
  database.run("teams", function (db, collection) {
    collection.find({}).toArray(function (err, teams) {
      assert.equal(err, null);
      if (teams.length === 0) {
        done(
          "No teams found, please create a new one with '!team create [NAME]'"
        );
      }
      done(
        teams
          .map((t) => {
            return formatTeam(t);
          })
          .join(", ")
      );
    });
  });
}

function formatTeam(t) {
  let str = "";
  str += `${t._id}: ${t.wins}-${t.draws}-${t.losses} created on ${moment(
    t.created_on
  )}`;
  if (t.retired_on) {
    str += ` retired on ${moment(t.retired_on)}`;
  }
  return str;
}

function run(config, args, context, done) {
  const defaultValue = args[0] ? undefined : "_show_stats";
  const subCommand = util.queryFrom(args[0], config.commands, defaultValue);

  let picked = "";
  if (subCommand === "_show_stats") {
    showStats(done);
    return;
  }
  args.shift();
  if (subCommand === "create") {
    let teamName = args.shift();
    teamName = teamName ? teamName.trim() : teamName;
    if (!teamName) {
      throw new error.UserError(`Invalid team name '${teamName}'`);
    }
    database.run("teams", function (db, collection) {
      collection.insertOne(
        {
          _id: teamName,
          wins: 0,
          draws: 0,
          losses: 0,
          created_on: moment(),
          retired_on: null,
        },
        function (err, result) {
          console.log(`Inserted team ${teamName} into team collection`);
          done(result);
        }
      );
    });
  } else if (subCommand === "retire") {
    retireTeam(done);
  } else if (subCommand === "list") {
    showAllTeams(done);
  } else if (subCommand === "draw") {
    const n = args[0] ? parseInt(args.shift()) : 1;
    updateStats(done, 0, n, 0);
  } else if (subCommand === "loss") {
    const n = args[0] ? parseInt(args.shift()) : 1;
    updateStats(done, 0, 0, n);
  } else if (subCommand === "win") {
    const n = args[0] ? parseInt(args.shift()) : 1;
    updateStats(done, n, 0, 0);
  } else {
    util.throwUsageUserError(config.name);
  }
}
exports.run = run;
