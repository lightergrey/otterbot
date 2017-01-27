/**
  * • `@bot learn <id> | <value>` Teach @bot to respond to id with a value
 */

module.exports = controller => {
  controller.hears([/^learn ([\w-]+) \| (.*)$/i], 'direct_message,direct_mention,mention', (bot, message) => {
    const [, id, value] = message.match;

    if (!id || !value) {
      bot.reply(message, 'I didn’t get that. Try `learn <id> | <value>`');
      return;
    }

    controller.storage.teams.get(id, (err, data) => {
      if (err) {
        bot.reply(message, `Something went wrong: ${err}`);
        return;
      }

      const newData = {
        id,
        values: [].concat(...(data ? data.values : []), value)
      };

      controller.storage.teams.save(Object.assign({}, data, newData), saveErr => {
        if (saveErr) {
          bot.reply(message, `Something went wrong: ${err}`);
          return;
        }

        bot.reply(message, `I learned "${id}": "${value}"`);
      });
    });
  });
};
