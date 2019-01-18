/**
 * • `?<query>` Get a random value for query
 */

module.exports = controller => {
  controller.hears(
    [/^\?(.*)/],
    "direct_message,direct_mention,mention,ambient",
    (bot, message) => {
      const id = message.match[1];

      if (!id) {
        bot.reply(message, "I didn’t get that. I need an <id>");
        return;
      }

      controller.storage.teams.get(id, (err, data) => {
        if (err) {
          bot.reply(message, `Something went wrong: ${err}`);
          return;
        }

        if (!data) {
          bot.reply(message, `Couldn’t find id: ${id}`);
          return;
        }

        const i = Math.floor(Math.random() * data.values.length);

        bot.reply(message, data.values[i]);
      });
    }
  );
};
