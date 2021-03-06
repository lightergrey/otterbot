/**
 * • `@bot forget <query>` Remove learned query
 * • `@bot forget <query> | <value>` Remove learned value
 */

module.exports = controller => {
  controller.hears(
    [/^forget ([\w-]+)(?: \| (.*))?/],
    "direct_message,direct_mention,mention",
    (bot, message) => {
      const [, id, value] = message.match;
      console.log(id, value);

      if (!id) {
        bot.reply(
          message,
          "I didn’t get that. Try `forget <id>` or `forget <id> | <value>`"
        );
        return;
      }

      if (!value) {
        controller.storage.teams.remove(id, err => {
          if (err) {
            bot.reply(message, `Something went wrong: ${err}`);
            return;
          }

          bot.reply(message, `I forgot "${id}"`);
        });
      }

      if (value) {
        controller.storage.teams.get(id, (err, data) => {
          if (err) {
            bot.reply(message, `Something went wrong: ${err}`);
            return;
          }

          if (!data) {
            bot.reply(message, `I can't seem to find "${value}" in ${id}`);
          }

          if (data) {
            const newData = {
              id,
              values: data.values.filter(storedValue => storedValue !== value)
            };

            controller.storage.teams.save(
              Object.assign({}, data, newData),
              saveErr => {
                if (saveErr) {
                  bot.reply(message, `Something went wrong: ${err}`);
                  return;
                }

                bot.reply(message, `I forgot "${id}": "${value}"`);
              }
            );
          }
        });
      }
    }
  );
};
