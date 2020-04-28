import util = require('../util');
import database = require('../database');
import assert = require('assert');
import error = require('../error');

export function run(config, args, context, done) {
  database.run('notes', function (db, collection) {
    collection.find({}).toArray(function (err, notes) {
      assert.equal(err, null);
      if (notes.length === 0) {
        done('No notes found');
        return;
      }
      const noteIds = notes.map((t) => {
        return t._id;
      });
      if (!args[0] || 'list'.startsWith(args[0])) {
        done(noteIds.join(', '));
        return;
      }
      let selectedNote;
      try {
        selectedNote = util.queryFrom(args[0], noteIds);
      } catch (e) {
        if (e instanceof error.UserError) {
          done(e.message);
          return;
        }
      }
      collection.findOne({ _id: selectedNote }, function (err, note) {
        assert.equal(err, null);
        if (note) {
          done(`${note._id}: ${note.value}`);
        }
      });
    });
  });
}
