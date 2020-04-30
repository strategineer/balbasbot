import assert = require('assert');
import { Note } from '../models/note';

import { SubCommand } from '../classes/sub-command';

export class SetCommand extends SubCommand {
  public constructor() {
    super('set');
  }
  protected _run(args, context, resolve, reject): void {
    const selectedNoteId = args[0];
    if (!selectedNoteId) {
      throw this.usageError();
    }
    args.shift();
    const noteText = args
      .map((a) => a.trim())
      .join(' ')
      .trim();
    if (!noteText) {
      Note.deleteOne({ id: selectedNoteId }, function (err) {
        assert.equal(err, null);
        resolve(`Deleted note '${selectedNoteId}'`);
      });
      return;
    }
    Note.findOne({ id: selectedNoteId }, function (err, note) {
      const isUpdate = note;
      if (isUpdate) {
        note.text = noteText;
      } else {
        note = new Note({ id: selectedNoteId, text: noteText });
      }
      note.save(function (err) {
        assert.equal(err, null);
        let msg = isUpdate ? 'Updated note' : 'Added new note';
        msg += ` ${selectedNoteId}': '${noteText}`;
        resolve(msg);
      });
    });
  }
}
