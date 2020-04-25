const roll = require("./roll.js");

describe("die", function () {
  it("should return a 1 when low roll", function () {
    spyOn(Math, "random").and.returnValue(0);
    const res = roll.die(100);
    expect(res).toEqual(1);
  });
  it("should return a 1 when high roll", function () {
    const value = 100;
    spyOn(Math, "random").and.returnValue(0.9999999999);
    const res = roll.die(value);
    expect(res).toEqual(value);
  });
  it("should throw when given a negative number", function () {
    expect(function () {
      roll.die(-100);
    }).toThrow(new Error("You can't roll a negative number!"));
  });
});
