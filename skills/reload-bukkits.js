/**
 * • `@bot reload bukkits` Gets all the bukkits from the bukkitSources
 */

const scrapeIt = require('scrape-it');

module.exports = controller => {
  const makeBukkitsFromSourceAndFileNames = (source, fileNames) => {
    return fileNames
      .filter(fileName => (/\.(gif|jpg|jpeg|png)$/i).test(fileName))
      .map(fileName => ({
        source,
        fileName
      }));
  };

  controller.hears(['^reload bukkits'], 'direct_message,direct_mention,mention', (bot, message) => {
    controller.storage.teams.get('bukkitSource', (err, data) => {
      if (err) {
        bot.reply(message, `Something went wrong: ${err}`);
        return;
      }

      if (!data) {
        bot.reply(message, 'No bukkitSource. Try `learn bukkitSource | <url>`');
        return;
      }

      const requests = data.values
        .map(item => item.replace(/^<|>$/g, ''))
        .map(source => {
          const config = {
            values: {
              listItem: 'a',
              attr: 'href'
            }
          };

          return scrapeIt(source, config)
            .then(fileNames => makeBukkitsFromSourceAndFileNames(source, fileNames.values));
        });

      Promise.all(requests).then(responses => {
        const bukkits = [].concat(...responses);
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
