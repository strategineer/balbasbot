import * as perms from "./permissions";
import * as util from "./util";
import * as error from "./error";

describe("getPermissionLevel", function () {
  it("should throw error if given an undefined username", function () {
    expect(function () {
      perms.getPermissionLevel(undefined);
    }).toThrowError(error.BotError);
  });
  it("should throw error if given a null username", function () {
    expect(function () {
      perms.getPermissionLevel(null);
    }).toThrowError(error.BotError);
  });
  it("should return 0 for my username", function () {
    const res = perms.getPermissionLevel(util.data.users.me);
    expect(res).toEqual(0);
  });
  it("should return 1 for any mod usernames", function () {
    for (var u of util.data.users.mods) {
      const res = perms.getPermissionLevel(u);
      expect(res).toEqual(1);
    }
  });
  it("should return 2 for any other username", function () {
    const res = perms.getPermissionLevel("asioehaeisontieoashtiaeosn");
    expect(res).toEqual(2);
  });
});
