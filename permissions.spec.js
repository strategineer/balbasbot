const perms = require('./permissions.js')
const util = require('./util.js')

describe("getPermissionLevel", function() {
    it("should return 0 for my username", function() {
        const res = perms.getPermissionLevel(util.data.users.me);
        expect(res).toEqual(0);
    });
    it("should return 1 for any mod usernames", function() {
        for(u of util.data.users.mods) {
            const res = perms.getPermissionLevel(u);
            expect(res).toEqual(1);
        }
    });
    it("should return 2 for any other username", function() {
        const res = perms.getPermissionLevel("asioehaeisontieoashtiaeosn");
        expect(res).toEqual(2);
    });
});
