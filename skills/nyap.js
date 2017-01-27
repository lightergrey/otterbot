/**
 * • `@bot [🐟|🐠|🐡|🍤|🐌|🦀]` Feed the otter
 */

module.exports = controller => {
  controller.hears([':fish:', ':tropical_fish:', ':crab:', ':snail:', ':blowfish:', ':fried_shrimp:'], 'direct_message,direct_mention,mention', (bot, message) => {
    controller.storage.teams.get('bukkits', (err, data) => {
      if (err) {
        bot.reply(message, 'nyap');
        return;
      }

      const bukkits = [].concat(...(data.values || []));

      if (bukkits.length === 0) {
        bot.reply(message, 'nyap');
        return;
      }

      const matches = bukkits.filter(item => new RegExp('nyap', 'i').test(item.fileName));

      const match = matches[Math.floor(Math.random() * matches.length)];

      if (!match) {
        bot.reply(message, 'nyap');
        return;
      }

      bot.reply(message, `${match.source}${match.fileName}`);
    });
  });
};
