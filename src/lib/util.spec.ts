import { queryFrom, pick, splitArgs } from './util';
import { UserError, BotError } from './error';

describe('queryFrom', function () {
  it('should throw user error if too vague', function () {
    const query = 't';
    const choices = ['time', 'test'];
    const defaultChoice = 'test';
    expect(function () {
      queryFrom(query, choices, defaultChoice);
    }).toThrowError(
      UserError,
      `'${query}' is too vague, did you mean [${choices}]?`
    );
  });
  it('should throw user error if not found', function () {
    const query = 'ze';
    const choices = ['blah', 'test'];
    const defaultChoice = undefined;
    expect(function () {
      const res = queryFrom(query, choices, defaultChoice);
      expect(res).toEqual('aisthnen');
    }).toThrowError(UserError, `'${query}' not known. Try [${choices}]`);
  });
  it('should throw bot error if no choices given', function () {
    expect(function () {
      queryFrom('ze', [], 'test');
    }).toThrowError(BotError);
  });
  it('should throw bot error if choices undefined', function () {
    expect(function () {
      queryFrom('ze', undefined, 'test');
    }).toThrowError(BotError);
  });
  it('should throw bot error if choices null', function () {
    expect(function () {
      queryFrom('ze', null, 'test');
    }).toThrowError(BotError);
  });
  it('should return found choice properly', function () {
    const query = 'te';
    const choices = ['blah', 'test'];
    const defaultChoice = 'test';
    const res = queryFrom(query, choices, defaultChoice);
    expect(res).toEqual(choices[1]);
  });
  it('should return default choice if query is undefined', function () {
    const query = undefined;
    const choices = ['blah', 'test'];
    const defaultChoice = 'crazy';
    const res = queryFrom(query, choices, defaultChoice);
    expect(res).toEqual(defaultChoice);
  });
  it('should return default choice if query is null', function () {
    const query = null;
    const choices = ['blah', 'test'];
    const defaultChoice = 'crazy';
    const res = queryFrom(query, choices, defaultChoice);
    expect(res).toEqual(defaultChoice);
  });
  it('should return default choice if query is just whitespace', function () {
    const query = '    ';
    const choices = ['blah', 'test'];
    const defaultChoice = 'crazy';
    const res = queryFrom(query, choices, defaultChoice);
    expect(res).toEqual(defaultChoice);
  });
});

describe('pick', function () {
  it('should throw error if given undefined', function () {
    expect(function () {
      pick(undefined);
    }).toThrowError(BotError);
  });
  it('should throw error if given null', function () {
    expect(function () {
      pick(null);
    }).toThrowError(BotError);
  });
  it('should throw error if given an empty list', function () {
    expect(function () {
      pick([]);
    }).toThrowError(BotError);
  });
  it('should return the only element in the list of a list with one element', function () {
    const a = 'a';
    const res = pick([a]);
    expect(res).toEqual(a);
  });
  it('should return the correct element in the list given a specific random float', function () {
    spyOn(Math, 'random').and.returnValue(0.5);
    const a = 'a';
    const b = 'b';
    const c = 'c';
    const res = pick([a, b, c]);
    expect(res).toEqual(b);
  });
});

describe('splitArgs', function () {
  it('should split args properly', function () {
    const res = splitArgs('run test "bob " "saget bob"', '"');
    expect(res).toEqual(['run', 'test', 'bob', 'saget bob']);
  });
  it('should split args properly 2', function () {
    const res = splitArgs('run test "bob " "saget bob', '"');
    expect(res).toEqual(['run', 'test', 'bob', 'saget bob']);
  });
  it('should split args properly when no separators present', function () {
    const res = splitArgs('run test bob', '"');
    expect(res).toEqual(['run', 'test', 'bob']);
  });
  it('should handle a single separator reasonably', function () {
    const res = splitArgs('run test" bob', '"');
    expect(res).toEqual(['run', 'test', 'bob']);
  });
  it('should ignore whitespace at start', function () {
    const res = splitArgs('  run test" bob', '"');
    expect(res).toEqual(['run', 'test', 'bob']);
  });
  it('should ignore whitespace at end', function () {
    const res = splitArgs('run test" bob      ', '"');
    expect(res).toEqual(['run', 'test', 'bob']);
  });
});
