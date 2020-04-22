function run(args, client, target, context, msg, self) {
    const num = rollDice();
    client.say(target, `You rolled a ${num}`);
}
exports.run = run;

// Function called when the "dice" command is issued
function rollDice () {
    const sides = 6;
    return Math.floor(Math.random() * sides) + 1;
}
