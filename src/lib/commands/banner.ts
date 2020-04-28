import fs = require('fs');
import path = require('path');

import util = require('../util');
import database = require('../database');
import assert = require('assert');
import error = require('../error');

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
  database.run('notes', function (db, collection) {
    collection.find({}).toArray(function (err, notes) {
      assert.equal(err, null);
      if (notes.length === 0) {
        done('No notes found');
        return;
      }
      const noteIds = notes.map((t) => {
        return t._id;
      });
      let selectedNote;
      try {
        selectedNote = util.queryFrom(args[0], noteIds);
      } catch (e) {
        if (e instanceof error.UserError) {
          done(e.message);
          return;
        }
      }
      collection.findOne({ _id: selectedNote }, function (err, note) {
        assert.equal(err, null);
        if (note) {
          setBannerText(note.value);
        }
      });
    });
  });
}
