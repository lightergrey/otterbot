/**
 * • `bukkit` Returns a random bukkit from any of the bukkitSources
 * • `bukkit <query>` Returns a random bukkit that matches the query from any of the bukkitSources
 * • `bukkit <query> from <source>` Returns a random bukkit that matches the query from source
 * • `@bot reload bukkits` Gets all the bukkits from the bukkitSources
 */

const scrapeIt = require('scrape-it');
const fuzzy = require('fuzzy');

module.exports = controller => {
  let bukkits = [];

  const makeBukkitsFromUrlAndFileNames = (url, fileNames) => {
    return fileNames
      .filter(fileName => (/\.(gif|jpg|jpeg|png)$/i).test(fileName))
      .map(fileName => ({
        source: url,
        fileName
      }));
  };

  controller.storage.teams.get('bukkits', (err, bukkitsFromStorage) => {
    if (err) {
      return;
    }

    bukkits = bukkitsFromStorage ? bukkitsFromStorage.values : [];
  });

  controller.hears([/^bukkit\s?([\w-]+)?(?: from (\w+))?$/i], 'direct_message,direct_mention,mention,ambient', (bot, message) => {
    const [, fileName, source] = message.match;

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

  controller.hears(['^reload bukkits'], 'direct_message,direct_mention,mention', (bot, message) => {
    controller.storage.teams.get('bukkitSource', (err, bukkitSource) => {
      if (err) {
        bot.reply(message, `Something went wrong: ${err}`);
        return;
      }

      if (!bukkitSource) {
        bot.reply(message, 'No bukkitSource. Try `learn bukkitSource | <url>`');
        return;
      }

      const requests = bukkitSource.values
        .map(item => item.replace(/^<|>$/g, ''))
        .map(url => {
          const config = {
            values: {
              listItem: 'a',
              attr: 'href'
            }
          };

          return scrapeIt(url, config)
            .then(fileNames => makeBukkitsFromUrlAndFileNames(url, fileNames.values));
        });

      Promise.all(requests).then(responses => {
        bukkits = [].concat(...responses);

        controller.storage.teams.save({id: 'bukkits', values: bukkits}, requestErr => {
          if (requestErr) {
            bot.reply(message, `Something went wrong: ${requestErr}`);
            return;
          }

          bot.reply(message, `${bukkits.length} bukkits loaded.`);
        });
      });
    });
  });
};
