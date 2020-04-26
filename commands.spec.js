const commands = require("./commands.js");
const perms = require("./permissions.js");
const util = require("./util.js");
const error = require("./error.js");

describe("getCommandsForUser", function () {
  it("should throw error if given an undefined username", function () {
    expect(function () {
      commands.getCommandsForUser(undefined);
    }).toThrow(new error.BotError());
  });
  it("should throw error if given a null username", function () {
    expect(function () {
      commands.getCommandsForUser(null);
    }).toThrow(new error.BotError());
  });
  it("should return the proper commands for level 0", function () {
    const n = 0;
    spyOn(perms, "getPermissionLevel").and.returnValue(n);
    const expected = util.data.commands.choices.filter(
      (c) => util.data.commands.details[c].permissions >= n
    );
    const res = commands.getCommandsForUser("me");
    expect(res).toEqual(expected);
  });
  it("should return the proper commands for level 1", function () {
    const n = 1;
    spyOn(perms, "getPermissionLevel").and.returnValue(n);
    const expected = util.data.commands.choices.filter(
      (c) => util.data.commands.details[c].permissions >= n
    );
    const res = commands.getCommandsForUser("me");
    expect(res).toEqual(expected);
  });
  it("should return the proper commands for level 2", function () {
    const n = 2;
    spyOn(perms, "getPermissionLevel").and.returnValue(n);
    const expected = util.data.commands.choices.filter(
      (c) => util.data.commands.details[c].permissions >= n
    );
    const res = commands.getCommandsForUser("me");
    expect(res).toEqual(expected);
  });
  it("should return the proper commands for level 3", function () {
    const n = 3;
    spyOn(perms, "getPermissionLevel").and.returnValue(n);
    const expected = util.data.commands.choices.filter(
      (c) => util.data.commands.details[c].permissions >= n
    );
    const res = commands.getCommandsForUser("me");
    expect(res).toEqual(expected);
  });
});
