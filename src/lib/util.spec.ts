import * as util from './util';
import * as error from './error';

describe('queryFrom', function () {
  it('should throw user error if too vague', function () {
    const query = 't';
    const choices = ['time', 'test'];
    const defaultChoice = 'test';
    expect(function () {
      util.queryFrom(query, choices, defaultChoice);
    }).toThrowError(
      error.UserError,
      `${query} is too vague, did you mean [${choices}]?`
    );
  });
  it('should throw user error if not found', function () {
    const query = 'ze';
    const choices = ['blah', 'test'];
    const defaultChoice = undefined;
    expect(function () {
      const res = util.queryFrom(query, choices, defaultChoice);
      expect(res).toEqual('aisthnen');
    }).toThrowError(error.UserError, `${query} not known. Try [${choices}]`);
  });
  it('should throw bot error if no choices given', function () {
    expect(function () {
      util.queryFrom('ze', [], 'test');
    }).toThrowError(error.BotError);
  });
  it('should throw bot error if choices undefined', function () {
    expect(function () {
      util.queryFrom('ze', undefined, 'test');
    }).toThrowError(error.BotError);
  });
  it('should throw bot error if choices null', function () {
    expect(function () {
      util.queryFrom('ze', null, 'test');
    }).toThrowError(error.BotError);
  });
  it('should return found choice properly', function () {
    const query = 'te';
    const choices = ['blah', 'test'];
    const defaultChoice = 'test';
    const res = util.queryFrom(query, choices, defaultChoice);
    expect(res).toEqual(choices[1]);
  });
  it('should return default choice if query is undefined', function () {
    const query = undefined;
    const choices = ['blah', 'test'];
    const defaultChoice = 'crazy';
    const res = util.queryFrom(query, choices, defaultChoice);
    expect(res).toEqual(defaultChoice);
  });
  it('should return default choice if query is null', function () {
    const query = null;
    const choices = ['blah', 'test'];
    const defaultChoice = 'crazy';
    const res = util.queryFrom(query, choices, defaultChoice);
    expect(res).toEqual(defaultChoice);
  });
  it('should return default choice if query is just whitespace', function () {
    const query = '    ';
    const choices = ['blah', 'test'];
    const defaultChoice = 'crazy';
    const res = util.queryFrom(query, choices, defaultChoice);
    expect(res).toEqual(defaultChoice);
  });
});

describe('pick', function () {
  it('should throw error if given undefined', function () {
    expect(function () {
      util.pick(undefined);
    }).toThrowError(error.BotError);
  });
  it('should throw error if given null', function () {
    expect(function () {
      util.pick(null);
    }).toThrowError(error.BotError);
  });
  it('should throw error if given an empty list', function () {
    expect(function () {
      util.pick([]);
    }).toThrowError(error.BotError);
  });
  it('should return the only element in the list of a list with one element', function () {
    const a = 'a';
    const res = util.pick([a]);
    expect(res).toEqual(a);
  });
  it('should return the correct element in the list given a specific random float', function () {
    spyOn(Math, 'random').and.returnValue(0.5);
    const a = 'a';
    const b = 'b';
    const c = 'c';
    const res = util.pick([a, b, c]);
    expect(res).toEqual(b);
  });
});
