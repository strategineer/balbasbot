const util = require('../util.js')
const database = require('../database.js')

const TEAMS_SELECT_SQL = "SELECT name, wins, losses, draws, created_on, retired_on FROM BLOOD_BOWL_TEAM ORDER BY created_on DESC";
const TEAM_SELECT_SQL = "SELECT name, wins, losses, draws, created_on, retired_on FROM BLOOD_BOWL_TEAM WHERE retired_on is null ORDER BY created_on DESC LIMIT 1";
const TEAM_INSERT_SQL = "INSERT INTO BLOOD_BOWL_TEAM (name, wins, losses, draws, created_on, retired_on) VALUES (?, 0, 0, 0, datetime('now'), null)";
const TEAM_UPDATE_STATS_SQL = "UPDATE BLOOD_BOWL_TEAM SET wins=?, draws=?, losses=? WHERE name=?";
const TEAM_RETIRE_SQL = "UPDATE BLOOD_BOWL_TEAM SET retired_on=datetime('now') WHERE name=?";

function updateStats(client, target, delta_wins, delta_draws, delta_losses) {
    database.db.serialize(() => {
        database.db.get(TEAM_SELECT_SQL, [], (err, row) => {
            if (err) { return console.error(err.message); }
            if (row) {
                database.db.run(TEAM_UPDATE_STATS_SQL, [row.wins + delta_wins, row.draws + delta_draws, row.losses + delta_losses, row.name], (err) => {});
                showStats(client, target);
            }
        });
    });
}

function showStats(client, target) {
    database.db.serialize(() => {
        database.db.get(TEAM_SELECT_SQL, [], (err, row) => {
            if (err) { return console.error(err.message); }
            if (row) {
                client.say(target, `${row.name}: ${row.wins}-${row.draws}-${row.losses} created on ${row.created_on}`);
            } else {
                client.say(target, `No team currently set, try !team create [TEAM_NAME]`);
            }
        });
    });
}

function retireTeam(client, target) {
    database.db.serialize(() => {
        database.db.get(TEAM_SELECT_SQL, [], (err, row) => {
            if (err) { return console.error(err.message); }
            if (row) {
                database.db.run(TEAM_RETIRE_SQL, [row.name], (err) => {
                    if (err) { return console.error(err.message); }
                    client.say(target, `Team ${row.name} retired with ${row.wins}-${row.draws}-${row.losses}`);
                });
            }
        });
    });
}

function showAllTeams(client, target) {
    database.db.serialize(() => {
        database.db.all(TEAMS_SELECT_SQL, [], (err, rows) => {
            if (err) { return console.error(err.message); }
            let str = ''
            rows.forEach((row) => {
                str += `${row.name}: ${row.wins}-${row.draws}-${row.losses} created on ${row.created_on}`;
                if (row.retired_on) {
                    str += `retired on ${row.retired_on}, `;
                }
            });
            client.say(target, str);
        });
    });
}

function run(args, client, target, context, msg, self) {
    const defaultValue = args[0] ? undefined : '_show_stats';
    const subCommand = util.queryFrom(args[0], util.data.commands.details['team'].commands, client, target, defaultValue);

    let picked = '';
    if (subCommand === '_show_stats') {
        showStats(client, target);
    } else {
        args.shift()
        if (subCommand === 'create') {
            const teamName = args.shift();
            database.db.run(TEAM_INSERT_SQL, [teamName], (err) => {
                if (err) { return console.error(err.message); }
            });
        } else if (subCommand === 'retire') {
            retireTeam(client, target);
        } else if (subCommand === 'list') {
            showAllTeams(client, target);
        }
        if (subCommand === 'draw') {
            const n = args[0] ? parseInt(args.shift()): 1;
            updateStats(client, target, 0, n, 0);
        } else if (subCommand === 'loss') {
            const n = args[0] ? parseInt(args.shift()): 1;
            updateStats(client, target, 0, 0, n);
        } else if (subCommand === 'win') {
            const n = args[0] ? parseInt(args.shift()): 1;
            updateStats(client, target, n, 0, 0);
        } else {
            console.log(`* Unknown !team ${subCommand}`);
            return;
        }
    }
}
exports.run = run;