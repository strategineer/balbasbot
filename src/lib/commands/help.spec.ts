import { HelpCommand } from './help';
import * as cmds from '../commands';
import { getCommandUsageHelp } from '../util';
import { UserError } from '../error';

describe('HelpCommand', function () {
  describe('run', function () {
    const context = { username: 'tyros' };
    let help;
    beforeEach(function () {
      help = new HelpCommand();
    });

    it('should throw when given no args', function (done) {
      const commandChoices = ['pun', 'ball', 'eat'];
      spyOn(cmds, 'getCommandsForUser').and.returnValue(commandChoices);

      help.run([], context).catch((err) => {
        expect(err).toBeInstanceOf(UserError);
        expect(err.message).toEqual(
          `Get help on specific commands by running '!help [${commandChoices}]'`
        );
        done();
      });
    });
    it('should return a help message', function (done) {
      const subCommand = 'roll';
      help.run([subCommand], context).then((res) => {
        expect(res).toEqual(getCommandUsageHelp(subCommand));
        done();
      });
    });
  });
});
