import util = require('../util');
import assert = require('assert');
import error = require('../error');

import Note from '../models/note';

export function run(config, args, context, done) {
  Note.find({}, function (err, notes) {
    assert.equal(err, null);
    if (notes.length === 0) {
      done('No notes found');
      return;
    }
    const noteIds = notes.map((n) => {
      return n.id;
    });
    if (!args[0] || 'list'.startsWith(args[0])) {
      done(noteIds.join(', '));
      return;
    }
    let selectedNoteId;
    try {
      selectedNoteId = util.queryFrom(args[0], noteIds);
    } catch (e) {
      if (e instanceof error.UserError) {
        done(e.message);
        return;
      }
    }
    const selectedNote = notes.find((n) => n.id === selectedNoteId);
    if (selectedNote) {
      done(`${selectedNote.id}: ${selectedNote.text}`);
    }
  });
}
