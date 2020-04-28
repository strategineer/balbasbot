import util = require('./util');
import database = require('./database');
import error = require('./error');

export function track(username, eventName) {
  database.run('users', function (db, collection) {
    collection.updateOne(
      { _id: username },
      { $inc: { [eventName]: 1 } },
      { upsert: true },
      function (err, result) {
        console.log(`Tracked '${eventName}' event for user '${username}'`);
      }
    );
  });
}
