const util = require('./util.js')

describe("pick", function() {
    it("should return undefined if given undefined", function() {
        const res = util.pick(undefined);
        expect(res).toBeUndefined();
    });
    it("should return undefined if given null", function() {
        const res = util.pick(null);
        expect(res).toBeUndefined();
    });
    it("should return undefined if given an empty list", function() {
        const res = util.pick([]);
        expect(res).toBeUndefined();
    });
    it("should return the only element in the list of a list with one element", function() {
        const a = 'a';
        const res = util.pick([a]);
        expect(res).toEqual(a);
    });
    it("should return the correct element in the list given a specific random float", function() {
        spyOn(Math, 'random').and.returnValue(0.5);
        const a = 'a';
        const b = 'b';
        const c = 'c';
        const res = util.pick([a, b, c]);
        expect(res).toEqual(b);
    });
});
