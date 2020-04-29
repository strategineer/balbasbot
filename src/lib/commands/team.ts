import util = require('../util');
import assert = require('assert');

import { Team } from '../models/team';

import { SubCommand } from '../classes/sub-command';

export class TeamCommand extends SubCommand {
  public constructor() {
    super('team');
  }
  protected async _run(args, context): Promise<string | null> {
    const defaultValue = args[0] ? undefined : '_show_stats';
    const subCommand = util.queryFrom(
      args[0],
      this.config.commands,
      defaultValue
    );

    if (subCommand === 'create') {
      args.shift();
      const teamName = args.map((x) => x.trim()).join(' ');
      if (!teamName) {
        throw this.userError(`Invalid team name '${teamName}'`);
      }
      const team = new Team({ id: teamName });
      team.save(function (err, result) {
        console.log(`Inserted team ${teamName} into team collection`);
        return result;
      });
      return;
    }
    if (subCommand === 'list') {
      Team.find(function (err, teams) {
        if (err || teams.length == 0) {
          throw this.userError(
            "No teams found, please create a new one with '!team create [NAME]'"
          );
        } else {
          return teams
            .map((t) => {
              return t.toString();
            })
            .join(', ');
        }
      });
      return;
    }

    Team.findOne()
      .active()
      .exec(function (err, team) {
        if (err || !team) {
          throw this.userError(
            "No active team found, please create a new one with '!team create [NAME]'"
          );
        }
        if (args && args.length > 0) {
          args.shift();
        }
        if (subCommand === '_show_stats') {
          return team.toString();
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
            this.throwUsageError();
          }
        }
        team.save(function (err) {
          assert.equal(err, null);
          return team.toString();
        });
      });
  }
}
