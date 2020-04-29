import assert = require('assert');
import { Note } from '../models/note';

import { SubCommand } from '../classes/sub-command';

export class SetCommand extends SubCommand {
  public constructor() {
    super('set');
  }
  protected async _run(args, context): Promise<string | null> {
    const selectedNoteId = args[0];
    if (!selectedNoteId) {
      throw this.usageError();
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
        return `Updated note '${selectedNoteId}': '${noteText}`;
      });
    } else {
      Note.deleteOne({ id: selectedNoteId }, function (err) {
        assert.equal(err, null);
        return `Deleted note '${selectedNoteId}`;
      });
    }
    throw this.botError();
  }
}
