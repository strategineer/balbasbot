const help = require("./help.js");
const cmds = require("../commands.js");
const util = require("../util.js");

describe("run", function () {
  const done = jasmine.createSpy("done");
  const context = { username: "tyros" };

  it("should throw when given no args", function () {
    const commandChoices = ["pun", "ball", "eat"];
    spyOn(cmds, "getCommandsForUser").and.returnValue(commandChoices);

    expect(function () {
      help.run([], context, done);
    }).toThrow(
      new Error(
        `Get help on specific commands by running '!help [${commandChoices}]'`
      )
    );
  });
  it("should return a help message", function () {
    const subCommand = "roll";
    let expected = [];
    for (h of util.data.commands.details[subCommand].help) {
      expected.push(`${subCommand} ${h.example}: ${h.description})`);
    }
    const res = help.run([subCommand], context, done);
    expect(done).toHaveBeenCalledWith(expected.join(", "));
  });
});
