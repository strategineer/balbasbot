import util = require('../util');
import assert = require('assert');
import { UserError } from '../error';

import { Note } from '../models/note';

import { SubCommand } from '../classes/sub-command';

export class GetCommand extends SubCommand {
  public constructor() {
    super('get');
  }
  protected async _run(args, context): Promise<string | null> {
    Note.find({}, function (err, notes) {
      assert.equal(err, null);
      if (notes.length === 0) {
        return 'No notes found';
      }
      const noteIds = notes.map((n) => {
        return n.id;
      });
      if (!args[0] || 'list'.startsWith(args[0])) {
        return noteIds.join(', ');
      }
      let selectedNoteId;
      try {
        selectedNoteId = util.queryFrom(args[0], noteIds);
      } catch (e) {
        if (e instanceof UserError) {
          return e.message;
        }
      }
      const selectedNote = notes.find((n) => n.id === selectedNoteId);
      if (selectedNote) {
        return `${selectedNote.id}: ${selectedNote.text}`;
      }
    });
    throw this.botError();
  }
}
