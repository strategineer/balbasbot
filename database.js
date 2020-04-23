const util = require('./util.js')
const sqlite3 = require('sqlite3').verbose();

const TABLE_CHECK_SQL = "SELECT name FROM sqlite_master WHERE type='table' AND name='?'";
const TABLE_TRUNCATE_SQL = "TRUNCATE TABLE ?";

const db = new sqlite3.Database('./balbasbot.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the balbasbot database.');
});
exports.db = db;



function init() {
    db.serialize(() => {
        for (table of util.data.database.tables) {
            db.get(TABLE_CHECK_SQL, [table.name], (err, row) => {
                if(row) {
                    db.run(`CREATE TABLE ${table.name}${table.sql}`)
                }
            });
        }
    });
    return db;
}
exports.init = init;

function reset() {
    db.serialize(() => {
        for (table of util.data.database.tables) {
            db.run(TABLE_TRUNCATE_SQL, [table.name], (err) => {
            });
        }
    });
    return db;
}
exports.reset = reset;
