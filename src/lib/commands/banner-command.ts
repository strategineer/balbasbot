import util = require('../util');

import { Note } from '../models/note';

import { SubCommand } from '../classes/sub-command';
import { SharedFile } from '../classes/shared-file';

export class BannerCommand extends SubCommand {
  private sharedFile: SharedFile;
  private notes;
  public constructor(logger, client) {
    super(logger, client, 'banner');
    this.sharedFile = new SharedFile(
      logger,
      util.secretData.environment.bannerPath
    );
  }

  protected async _preRun(args, context): Promise<void> {
    this.notes = await Note.find({});
  }

  protected _run(args, context, resolve, reject): void {
    if (!args[0]) {
      this.sharedFile.setText('');
      resolve();
      return;
    }
    if (this.notes.length === 0) {
      reject('No notes found');
      return;
    }
    const noteIds = this.notes.map((t) => {
      return t.id;
    });
    const selectedNoteId = util.queryFrom(args[0], noteIds);
    const selectedNote = this.notes.find((n) => n.id == selectedNoteId);
    if (selectedNote) {
      this.sharedFile.setText(selectedNote.text);
      resolve();
    }
  }
}
