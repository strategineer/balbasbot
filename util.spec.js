const util = require("./util.js");
const error = require("./error.js");

describe("pick", function () {
  it("should throw error if given undefined", function () {
    expect(function () {
      util.pick(undefined);
    }).toThrowError(error.BotError);
  });
  it("should throw error if given null", function () {
    expect(function () {
      util.pick(null);
    }).toThrowError(error.BotError);
  });
  it("should throw error if given an empty list", function () {
    expect(function () {
      util.pick([]);
    }).toThrowError(error.BotError);
  });
  it("should return the only element in the list of a list with one element", function () {
    const a = "a";
    const res = util.pick([a]);
    expect(res).toEqual(a);
  });
  it("should return the correct element in the list given a specific random float", function () {
    spyOn(Math, "random").and.returnValue(0.5);
    const a = "a";
    const b = "b";
    const c = "c";
    const res = util.pick([a, b, c]);
    expect(res).toEqual(b);
  });
});
