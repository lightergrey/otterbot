module.exports = controller => {
  const welcomes = [
    "Ain't no thing.",
    "You're welcome.",
    "At your service.",
    "Delighted.",
    "Whatever.",
    "Yep.",
    "No, thank *you*.",
    "Oh, it's nothing.",
    "I aim to please.",
    "I do my best."
  ];

  const hellos = ["Good morning.", "Mornin'.", "Bonjour."];

  const byes = [
    "Bye.",
    "Good night.",
    "Seeya later.",
    "Nightie night.",
    "Hasta la vista."
  ];

  controller.hears(
    ["fuck you"],
    "direct_message,direct_mention,mention",
    (bot, message) => {
      bot.reply(message, "Fuck you too, buddy.");
    }
  );

  controller.hears(
    ["thank(?:s| you)?,?"],
    "direct_message,direct_mention,mention",
    (bot, message) => {
      bot.reply(message, welcomes[Math.floor(Math.random() * welcomes.length)]);
    }
  );

  controller.hears(
    [
      /^(good morning|morning|mornin'),? (?:otterbot|all|everybody|everyone|otters)/i
    ],
    "direct_message,direct_mention,mention,ambient",
    (bot, message) => {
      bot.reply(message, hellos[Math.floor(Math.random() * hellos.length)]);
    }
  );

  controller.hears(
    [
      /^(bye|good evening|good night|goodnight|g'night|night|nightie night),? (?:otterbot|all|everybody|everyone|otters)/i
    ],
    "direct_message,direct_mention,mention,ambient",
    (bot, message) => {
      bot.reply(message, byes[Math.floor(Math.random() * byes.length)]);
    }
  );
};
