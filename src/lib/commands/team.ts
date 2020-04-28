import util = require('../util');
import assert = require('assert');
import error = require('../error');

import Team from '../models/team';

export function run(config, args, context, done) {
  const defaultValue = args[0] ? undefined : '_show_stats';
  const subCommand = util.queryFrom(args[0], config.commands, defaultValue);

  if (subCommand === 'create') {
    args.shift();
    let teamName = args.map((x) => x.trim()).join(' ');
    if (!teamName) {
      throw new error.UserError(`Invalid team name '${teamName}'`);
    }
    const team = new Team({ id: teamName });
    team.save(function (err, result) {
      console.log(`Inserted team ${teamName} into team collection`);
      done(result);
    });
    return;
  }
  if (subCommand === 'list') {
    Team.find(function (err, teams) {
      if (err || teams.length == 0) {
        done(
          "No teams found, please create a new one with '!team create [NAME]'"
        );
      } else {
        done(
          teams
            .map((t) => {
              return t.toString();
            })
            .join(', ')
        );
      }
    });
    return;
  }

  Team.findOne()
    .active()
    .exec(function (err, team) {
      if (err || !team) {
        done(
          "No active team found, please create a new one with '!team create [NAME]'"
        );
        return;
      }
      if (args && args.length > 0) {
        args.shift();
      }
      if (subCommand === '_show_stats') {
        done(team.toString());
        return;
      }
      if (subCommand === 'retire') {
        team.retiredOn = new Date();
      } else {
        const n = args[0] ? parseInt(args.shift()) : 1;
        if (subCommand === 'draw') {
          team.draws += n;
        } else if (subCommand === 'loss') {
          team.losses += n;
        } else if (subCommand === 'win') {
          team.wins += n;
        } else {
          util.throwUsageUserError(config.name);
        }
      }
      team.save(function (err) {
        assert.equal(err, null);
        done(team.toString());
      });
    });
}
