import * as commands from './commands';
import * as perms from './permissions';
import { data } from './util';
import { BotError } from './error';

describe('getCommandsForUser', function () {
  it('should throw error if given an undefined username', function () {
    expect(function () {
      commands.getCommandsForUser(undefined);
    }).toThrowError(BotError);
  });
  it('should throw error if given a null username', function () {
    expect(function () {
      commands.getCommandsForUser(null);
    }).toThrowError(BotError);
  });
  it('should return the proper commands for level 0', function () {
    const n = 0;
    spyOn(perms, 'getPermissionLevel').and.returnValue(n);
    const expected = data.commands
      .filter((c) => c.permissions >= n)
      .map((c) => c.name);
    const res = commands.getCommandsForUser('me');
    expect(res).toEqual(expected);
  });
  it('should return the proper commands for level 1', function () {
    const n = 1;
    spyOn(perms, 'getPermissionLevel').and.returnValue(n);
    const expected = data.commands
      .filter((c) => c.permissions >= n)
      .map((c) => c.name);
    const res = commands.getCommandsForUser('me');
    expect(res).toEqual(expected);
  });
  it('should return the proper commands for level 2', function () {
    const n = 2;
    spyOn(perms, 'getPermissionLevel').and.returnValue(n);
    const expected = data.commands
      .filter((c) => c.permissions >= n)
      .map((c) => c.name);
    const res = commands.getCommandsForUser('me');
    expect(res).toEqual(expected);
  });
});
