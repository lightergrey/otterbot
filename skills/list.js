/**
  * • `@bot list <query>` Show all possible values for query
 */

module.exports = controller => {
  controller.hears([/^list (.*)/], 'direct_message,direct_mention,mention', (bot, message) => {
    const id = message.match[1];

    if (!id) {
      bot.reply(message, 'I didn’t get that. I need an <id>');
      return;
    }

    controller.storage.teams.get(id, (err, data) => {
      if (err) {
        bot.reply(message, `Something went wrong: ${err}`);
        return;
      }

      if (!data) {
        bot.reply(message, `I couldn’t find "${id}"`);
        return;
      }

      bot.reply(message, data.values.reduce((prev, curr, index) => prev + `${index + 1}. ${curr}\n`, ''));
    });
  });
};
