import database = require('./database');
import assert = require('assert');

export function track(username, eventName) {
  database.run('users', function (db, collection) {
    collection.updateOne(
      { _id: username },
      { $inc: { [eventName]: 1 } },
      { upsert: true },
      function (err) {
        assert.equal(err, null);
        console.log(`Tracked '${eventName}' event for user '${username}'`);
      }
    );
  });
}
