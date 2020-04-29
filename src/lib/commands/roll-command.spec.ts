import { RollCommand } from './roll-command';
import { UserError } from '../error';

describe('RollCommand', function () {
  let roll;
  const context = { username: 'tyros' };
  beforeEach(function () {
    roll = new RollCommand();
  });
  describe('run', function () {
    describe('roll', function () {
      it('should use n by default when rolling a die', function (done) {
        const n = 6;
        const rolled = 1;
        spyOn(Math, 'random').and.returnValue(0);
        roll.run([], context).then((res) => {
          expect(res).toEqual(`You rolled ${rolled} on a d${n}`);
          done();
        });
      });
      it('should use the passed in number when rolling a die', function (done) {
        const n = 20;
        const rolled = 11;
        spyOn(Math, 'random').and.returnValue(0.5);
        roll.run([n], context).then((res) => {
          expect(res).toEqual(`You rolled ${rolled} on a d${n}`);
          done();
        });
      });
      it('should use the passed in number and count when rolling a die', function (done) {
        const n = 20;
        const rolled = [11, 11, 11, 11, 11];
        spyOn(Math, 'random').and.returnValue(0.5);
        roll.run([n, 5], context).then((res) => {
          expect(res).toEqual(`You rolled ${rolled} on a d${n}`);
          done();
        });
      });
    });
    describe('list', function () {
      it('should throw an error if list has less than two elements', function (done) {
        roll.run(['list', 'A'], context).catch((err) => {
          expect(err).toBeInstanceOf(UserError);
          expect(err.message).toEqual(
            "Must have at least two items to select from. Try '!roll list A B C'"
          );
          done();
        });
      });
      it('should select an item from the given list', function (done) {
        spyOn(Math, 'random').and.returnValue(0.5);
        roll.run(['list', 'A', 'B', 'C'], context).then((res) => {
          expect(res).toEqual('B?');
          done();
        });
      });
    });
    describe('team', function () {
      it('should roll a team', function (done) {
        spyOn(Math, 'random').and.returnValue(0.5);
        roll.run(['team'], context).then((res) => {
          expect(res).toEqual('Khemri Tomb Kings?');
          done();
        });
      });
    });
    describe('skill', function () {
      it('should throw an error for using an unknown skill category', function (done) {
        roll.run(['skill', 'Z'], context).catch((err) => {
          expect(err).toBeInstanceOf(UserError);
          expect(err.message).toEqual(
            'Unknown skill category [Z], try G,A,P,S,M'
          );
          done();
        });
      });
      it('should use GAPS by default', function (done) {
        spyOn(Math, 'random').and.returnValue(0.5);
        roll.run(['skill'], context).then((res) => {
          expect(res).toEqual('Side Step? (using G,A,P,S)');
          done();
        });
      });
      it('should use G', function (done) {
        spyOn(Math, 'random').and.returnValue(0.5);
        roll.run(['skill', 'G'], context).then((res) => {
          expect(res).toEqual('Pass Block? (using G)');
          done();
        });
      });
      it('should use A', function (done) {
        spyOn(Math, 'random').and.returnValue(0.5);
        roll.run(['skill', 'A'], context).then((res) => {
          expect(res).toEqual('Leap? (using A)');
          done();
        });
      });
      it('should use S', function (done) {
        spyOn(Math, 'random').and.returnValue(0.5);
        roll.run(['skill', 'S'], context).then((res) => {
          expect(res).toEqual('Multiple Block? (using S)');
          done();
        });
      });
      it('should use P', function (done) {
        spyOn(Math, 'random').and.returnValue(0.5);
        roll.run(['skill', 'P'], context).then((res) => {
          expect(res).toEqual('Leader? (using P)');
          done();
        });
      });
      it('should use M', function (done) {
        spyOn(Math, 'random').and.returnValue(0.5);
        roll.run(['skill', 'M'], context).then((res) => {
          expect(res).toEqual('Horns? (using M)');
          done();
        });
      });
      it('should handle lower case categories', function (done) {
        spyOn(Math, 'random').and.returnValue(0.5);
        roll.run(['skill', 'm'], context).then((res) => {
          expect(res).toEqual('Horns? (using M)');
          done();
        });
      });
      it('should handle combined skill categories', function (done) {
        spyOn(Math, 'random').and.returnValue(0.5);
        roll.run(['skill', 'GM'], context).then((res) => {
          expect(res).toEqual('Tackle? (using G,M)');
          done();
        });
      });
      it('should handle seperated skill categories', function (done) {
        spyOn(Math, 'random').and.returnValue(0.5);
        roll.run(['skill', 'G', 'M'], context).then((res) => {
          expect(res).toEqual('Tackle? (using G,M)');
          done();
        });
      });
    });
  });

  describe('die', function () {
    it('should return a 1 when low roll', function () {
      spyOn(Math, 'random').and.returnValue(0);
      const res = roll.die(100);
      expect(res).toEqual(1);
    });
    it('should return a 1 when high roll', function () {
      const value = 100;
      spyOn(Math, 'random').and.returnValue(0.9999999999);
      const res = roll.die(value);
      expect(res).toEqual(value);
    });
    it('should throw when given a negative number', function () {
      expect(function () {
        roll.die(-100);
      }).toThrowError(UserError, "You can't roll a negative number!");
    });
  });
});
