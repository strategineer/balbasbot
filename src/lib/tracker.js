const util = require("./util.js");
const database = require("./database.js");
const assert = require("assert");
const error = require("./error.js");

function track(username, eventName) {
  database.run("users", function (db, collection) {
    collection.updateOne(
      { _id: username },
      { $inc: { [eventName]: 1 } },
      { upsert: true },
      function (err, result) {
        assert.equal(err, null);
        console.log(`Tracked '${eventName}' event for user '${username}'`);
      }
    );
  });
}
exports.track = track;
