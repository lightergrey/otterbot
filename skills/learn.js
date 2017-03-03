/**
  * • `@bot learn <query> | <value>` Teach @bot to respond to query with a value
 */
const getBukkits = require('../utils/get-bukkits');

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
        values: [].concat(...(data ? data.values : []), value).filter((value, index, self) => self.indexOf(value) === index)
      };

      controller.storage.teams.save(Object.assign({}, data, newData), saveErr => {
        if (saveErr) {
          bot.reply(message, `Something went wrong: ${err}`);
          return;
        }

        if (id === 'bukkitSources') {
          getBukkits(newData.values).then(data => {
            controller.storage.teams.save({id: 'bukkits', values: data}, err => {
              if (err) {
                bot.reply(message, `Something went wrong: ${err}`);
                return;
              }

              bot.reply(message, `${data.length} bukkits loaded.`);
            });
          });
          return;
        }

        bot.reply(message, `I learned "${id}": "${value}"`);
      });
    });
  });
};
