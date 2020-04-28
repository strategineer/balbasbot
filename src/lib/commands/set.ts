import util = require('../util');
import assert = require('assert');
import Note from '../models/note';

export function run(config, args, context, done) {
  const selectedNoteId = args[0];
  if (!selectedNoteId) {
    util.throwUsageUserError(config.name);
  }
  args.shift();
  const noteText = args
    .map((a) => a.trim())
    .join(' ')
    .trim();
  if (noteText) {
    const note = new Note({ id: selectedNoteId, text: noteText });
    note.save(function (err) {
      assert.equal(err, null);
      done(`Updated note '${selectedNoteId}': '${noteText}`);
    });
  } else {
    Note.deleteOne({ id: selectedNoteId }, function (err) {
      assert.equal(err, null);
      done(`Deleted note '${selectedNoteId}`);
    });
  }
}
