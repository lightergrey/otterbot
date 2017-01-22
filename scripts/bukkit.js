const scrapeIt = require('scrape-it');

module.exports = (controller) => {
  let bukkits = [];

  controller.storage.teams.get('bukkits', (err, bukkitsFromStorage) => {
    bukkits = bukkitsFromStorage ? bukkitsFromStorage.values : [];
  });

  controller.hears([/^bukkit\s?([\w-]+)?(?: from (\w+))?$/i], 'direct_message,direct_mention,mention', (bot, message) => {
    const [, fileName, source] = message.match;

    if (!bukkits.length) {
      bot.reply(message, 'No bukkits. Try `reload bukkits`');
      return;
    }

    const matches = bukkits
      .filter(item => (fileName ? new RegExp(fileName, 'i').test(item.fileName) : true))
      .filter(item => (source ? new RegExp(source, 'i').test(item.source) : true));

    const match = matches[Math.floor(Math.random() * matches.length)];

    if (!match) {
      bot.reply(message, 'Couldn’t find a match.');
      return;
    }

    bot.reply(message, `${match.source}${match.fileName}`);
  });

  controller.hears(['^reload bukkits'], 'direct_message,direct_mention,mention', (bot, message) => {
    controller.storage.teams.get('bukkitSource', (err, bukkitSource) => {
      if (!bukkitSource) {
        bot.reply(message, 'No bukkitSource. Try `learn bukkitSource | <url>`');
        return;
      }

      const requests = bukkitSource.values
        .map(item => item.replace(/^<|>$/g, ''))
        .map((url) => {
          const config = {
            values: {
              listItem: 'a',
              attr: 'href',
            },
          };

          return scrapeIt(url, config)
            .then(filenames => filenames.values
              .filter(fileName => (/\.(gif|jpg|jpeg|png)$/i).test(fileName))
              .map(fileName => ({
                source: url,
                fileName,
              })));
        });

      Promise.all(requests).then((responses) => {
        bukkits = [].concat(...responses);

        controller.storage.teams.save({ id: 'bukkits', values: bukkits }, (requestErr) => {
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
