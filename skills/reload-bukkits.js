/**
 * • `@bot reload bukkits` Gets all the bukkits from the bukkitSources
 */

const getBukkits = require('../utils/get-bukkits');

module.exports = controller => {
  controller.hears(['^reload bukkits'], 'direct_message,direct_mention,mention', (bot, message) => {
    controller.storage.teams.get('bukkitSources', (err, data) => {
      if (err) {
        bot.reply(message, `Something went wrong: ${err}`);
        return;
      }

      if (!data) {
        bot.reply(message, 'No bukkitSources. Try `learn bukkitSources | <url>`');
        return;
      }

      getBukkits(data.values).then(data => {
        controller.storage.teams.save({id: 'bukkits', values: data}, requestErr => {
          if (requestErr) {
            bot.reply(message, `Something went wrong: ${requestErr}`);
            return;
          }

          bot.reply(message, `${data.length} bukkits loaded.`);
        });
      });
    });
  });
};
