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

  protected _run(args, context, resolve, reject): void {
    if (!args[0]) {
      this.setBannerText('');
    }
    Note.find({}, function (err, notes) {
      assert.equal(err, null);
      if (notes.length === 0) {
        reject('No notes found');
        return;
      }
      const noteIds = notes.map((t) => {
        return t.id;
      });
      let selectedNoteId;
      try {
        selectedNoteId = util.queryFrom(args[0], noteIds);
      } catch (e) {
        if (e instanceof UserError) {
          reject(e.message);
        }
      }
      const selectedNote = notes.find((n) => n._id == selectedNoteId);
      if (selectedNote) {
        this.setBannerText(selectedNote.text);
      }
    });
    resolve();
  }
  private setBannerText(text): void {
    // TODO(keikakub): This duplicated code-ish, check setTimerText in timer-command.ts
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
        }.bind(this)
      );
    }
  }
}
