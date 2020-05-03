import fs = require('fs');
import path = require('path');

import util = require('../util');
import assert = require('assert');
import { UserError } from '../error';

import { Note } from '../models/note';

import { SubCommand } from '../classes/sub-command';

export class BannerCommand extends SubCommand {
  private oldText: string;
  public constructor(logger, client) {
    super(logger, client, 'banner');
  }

  protected _run(args, context, resolve, reject): void {
    if (!args[0]) {
      this.setBannerText('');
      resolve();
      return;
    }
    Note.find(
      {},
      function (err, notes): void {
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
        const selectedNote = notes.find((n) => n.id == selectedNoteId);
        if (selectedNote) {
          this.setBannerText(selectedNote.text);
          resolve();
        }
      }.bind(this)
    );
  }
  private setBannerText(text): void {
    // TODO(keikakub): This duplicated code-ish, check setTimerText in timer-command.ts
    if (this.oldText !== text) {
      fs.writeFile(
        path.resolve(util.secretData.environment.bannerPath),
        text,
        function (err): void {
          if (err) {
            this.logger.error(err);
            return;
          }
          this.logger.info(`set banner text to '${text}'`);
          this.oldText = text;
        }.bind(this)
      );
    }
  }
}
