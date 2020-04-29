import fs = require('fs');
import path = require('path');

import util = require('../util');
import assert = require('assert');
import { UserError } from '../error';

import { Note } from '../models/note';

import { SubCommand } from '../classes/sub-command';

export class BannerCommand extends SubCommand {
  private oldText: string;
  public constructor() {
    super('banner');
  }

  protected async _run(args, context): Promise<string | null> {
    if (!args[0]) {
      this.setBannerText('');
    }
    Note.find({}, function (err, notes) {
      assert.equal(err, null);
      if (notes.length === 0) {
        return 'No notes found';
      }
      const noteIds = notes.map((t) => {
        return t.id;
      });
      let selectedNoteId;
      try {
        selectedNoteId = util.queryFrom(args[0], noteIds);
      } catch (e) {
        if (e instanceof UserError) {
          return e.message;
        }
      }
      const selectedNote = notes.find((n) => n._id == selectedNoteId);
      if (selectedNote) {
        this.setBannerText(selectedNote.text);
      }
    });
    return;
  }
  private setBannerText(text): void {
    if (this.oldText !== text) {
      fs.writeFile(
        path.resolve(util.secretData.environment.bannerPath),
        text,
        function (err) {
          if (err) {
            return console.log(err);
          }
          console.log(`set banner text to '${text}'`);
          this.oldText = text;
        }
      );
    }
  }
}
