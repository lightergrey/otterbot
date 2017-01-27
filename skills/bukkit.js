/**
 * • `bukkit` Returns a random bukkit from any of the bukkitSources
 * • `bukkit <query>` Returns a random bukkit that matches the query from any of the bukkitSources
 * • `bukkit <query> from <source>` Returns a random bukkit that matches the query from source
 */

const fuzzy = require('fuzzy');

module.exports = controller => {
  controller.hears([/^bukkit\s?([\w-]+)?(?: from (\w+))?$/i], 'direct_message,direct_mention,mention,ambient', (bot, message) => {
    const [, fileName, source] = message.match;

    controller.storage.teams.get('bukkits', (err, data) => {
      if (err) {
        bot.reply(message, `Error getting bukkits: ${err}`);
        return;
      }

      const bukkits = [].concat(...(data ? data.values : []));

      if (bukkits.length === 0) {
        bot.reply(message, 'No bukkits. Try `reload bukkits`');
        return;
      }

      const matches = fuzzy.filter(source, bukkits, {extract: el => el.source})
        .map(el => (el.original ? el.original : el))
        .filter(item => (fileName ? new RegExp(fileName, 'i').test(item.fileName) : true));

      const match = matches[Math.floor(Math.random() * matches.length)];

      if (!match) {
        bot.reply(message, 'Couldn’t find a match.');
        return;
      }

      bot.reply(message, `${match.source}${match.fileName}`);
    });
  });
};
