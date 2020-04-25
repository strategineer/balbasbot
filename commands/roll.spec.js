const roll = require("./roll.js");
const util = require("../util.js");

describe("roll", function () {
  describe("run", function () {
    describe("roll", function () {
      it("should use n by default when rolling a die", function () {
        const n = 6;
        const rolled = 1;
        spyOn(Math, "random").and.returnValue(0);
        const res = roll.run([], undefined);
        expect(res).toEqual(`You rolled a ${rolled} on a d${n}`);
      });
      it("should use the passed in number when rolling a die", function () {
        const n = 20;
        const rolled = 11;
        spyOn(Math, "random").and.returnValue(0.5);
        const res = roll.run([n], undefined);
        expect(res).toEqual(`You rolled a ${rolled} on a d${n}`);
      });
    });
    describe("team", function () {
      it("should roll a team", function () {
        spyOn(Math, "random").and.returnValue(0.5);
        const res = roll.run(["team"], undefined);
        expect(res).toEqual("Khemri Tomb Kings?");
      });
    });
    describe("skill", function () {
      it("should throw an error for using an unknown skill category", function () {
        expect(function () {
          roll.run(["skill", "Z"], undefined);
        }).toThrow(new Error("Unknown skill category [Z], try G,A,P,S,M"));
      });
      it("should use GAPS by default", function () {
        spyOn(Math, "random").and.returnValue(0.5);
        const res = roll.run(["skill"], undefined);
        expect(res).toEqual("Side Step? (using G,A,P,S)");
      });
      it("should use G", function () {
        spyOn(Math, "random").and.returnValue(0.5);
        const res = roll.run(["skill", "G"], undefined);
        expect(res).toEqual("Pass Block? (using G)");
      });
      it("should use A", function () {
        spyOn(Math, "random").and.returnValue(0.5);
        const res = roll.run(["skill", "A"], undefined);
        expect(res).toEqual("Leap? (using A)");
      });
      it("should use S", function () {
        spyOn(Math, "random").and.returnValue(0.5);
        const res = roll.run(["skill", "S"], undefined);
        expect(res).toEqual("Multiple Block? (using S)");
      });
      it("should use P", function () {
        spyOn(Math, "random").and.returnValue(0.5);
        const res = roll.run(["skill", "P"], undefined);
        expect(res).toEqual("Leader? (using P)");
      });
      it("should use M", function () {
        spyOn(Math, "random").and.returnValue(0.5);
        const res = roll.run(["skill", "M"], undefined);
        expect(res).toEqual("Horns? (using M)");
      });
      it("should handle lower case categories", function () {
        spyOn(Math, "random").and.returnValue(0.5);
        const res = roll.run(["skill", "m"], undefined);
        expect(res).toEqual("Horns? (using M)");
      });
      it("should handle combined skill categories", function () {
        spyOn(Math, "random").and.returnValue(0.5);
        const res = roll.run(["skill", "GM"], undefined);
        expect(res).toEqual("Tackle? (using G,M)");
      });
      it("should handle seperated skill categories", function () {
        spyOn(Math, "random").and.returnValue(0.5);
        const res = roll.run(["skill", "G", "M"], undefined);
        expect(res).toEqual("Tackle? (using G,M)");
      });
    });
  });

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
});
