import * as help from "./help";
import * as cmds from "../commands";
import * as util from "../util";
import * as error from "../error";

describe("run", function () {
  const done = jasmine.createSpy("done");
  const context = { username: "tyros" };

  it("should throw when given no args", function () {
    const commandChoices = ["pun", "ball", "eat"];
    spyOn(cmds, "getCommandsForUser").and.returnValue(commandChoices);

    expect(function () {
      help.run(util.getCommandByName("help"), [], context, done);
    }).toThrowError(
      error.UserError,
      `Get help on specific commands by running '!help [${commandChoices}]'`
    );
  });
  it("should return a help message", function () {
    const subCommand = "roll";
    const res = help.run(
      util.getCommandByName("help"),
      [subCommand],
      context,
      done
    );
    expect(done).toHaveBeenCalledWith(util.getCommandUsageHelp(subCommand));
  });
});
