const util = require("../util.js");
const database = require("../database.js");
const assert = require("assert");
const error = require("../error.js");

function run(args, context, done) {
  const selectedNote = args[0];
  args.shift();
  const noteValue = args
    .map((a) => a.trim())
    .join(" ")
    .trim();
  database.run("notes", function (db, collection) {
    if (noteValue) {
      collection.update(
        { _id: selectedNote },
        { $set: { value: noteValue } },
        { upsert: true },
        function (err, result) {
          assert.equal(err, null);
          console.log(result);
          done(`Updated note '${selectedNote}': '${noteValue}`);
        }
      );
    } else {
      collection.deleteMany({ _id: selectedNote }, function (err, result) {
        assert.equal(err, null);
        done(`Deleted note '${selectedNote}`);
      });
    }
  });
}
exports.run = run;
