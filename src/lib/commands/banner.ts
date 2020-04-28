import fs = require('fs');
import path = require('path');

import util = require('../util');
import assert = require('assert');
import error = require('../error');

import Note from '../models/note';

let oldText;

function setBannerText(text) {
  if (oldText !== text) {
    fs.writeFile(
      path.resolve(util.secretData.environment.bannerPath),
      text,
      function (err) {
        if (err) {
          return console.log(err);
        }
        console.log(`set banner text to '${text}'`);
        oldText = text;
      }
    );
  }
}

export function run(config, args, context, done) {
  if (!args[0]) {
    setBannerText('');
    return;
  }
  Note.find({}, function (err, notes) {
    assert.equal(err, null);
    if (notes.length === 0) {
      done('No notes found');
      return;
    }
    const noteIds = notes.map((t) => {
      return t.id;
    });
    let selectedNoteId;
    try {
      selectedNoteId = util.queryFrom(args[0], noteIds);
    } catch (e) {
      if (e instanceof error.UserError) {
        done(e.message);
        return;
      }
    }
    let selectedNote = notes.find((n) => n._id == selectedNoteId);
    if (selectedNote) {
      setBannerText(selectedNote.text);
    }
  });
}
