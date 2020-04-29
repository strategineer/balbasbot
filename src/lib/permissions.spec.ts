import * as perms from './permissions';
import { data } from './util';
import { BotError } from './error';

describe('getPermissionLevel', function () {
  it('should throw error if given an undefined username', function () {
    expect(function () {
      perms.getPermissionLevel(undefined);
    }).toThrowError(BotError);
  });
  it('should throw error if given a null username', function () {
    expect(function () {
      perms.getPermissionLevel(null);
    }).toThrowError(BotError);
  });
  it('should return 0 for my username', function () {
    const res = perms.getPermissionLevel(data.users.me);
    expect(res).toEqual(0);
  });
  it('should return 1 for any mod usernames', function () {
    for (const u of data.users.mods) {
      const res = perms.getPermissionLevel(u);
      expect(res).toEqual(1);
    }
  });
  it('should return 2 for any other username', function () {
    const res = perms.getPermissionLevel('asioehaeisontieoashtiaeosn');
    expect(res).toEqual(2);
  });
});
