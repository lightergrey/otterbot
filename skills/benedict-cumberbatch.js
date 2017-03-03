/**
 * • `benedict cumberbatch` Spelling correction for a difficult name
 */

module.exports = controller => {
  controller.hears(['benedict cumberbatch'], 'direct_message,direct_mention,mention,ambient', (bot, message) => {
    controller.storage.teams.get('benedicts', (err, data) => {
      if (err) {
        bot.reply(message, `Error getting benedicts: ${err}`);
        return;
      }

      const benedicts = data ? data.values : [];

      controller.storage.teams.get('cumberbatches', (err, data) => {
        if (err) {
          bot.reply(message, `Error getting cumberbatches: ${err}`);
          return;
        }

        const cumberbatches = data ? data.values : [];

        if (benedicts.length > 0 && cumberbatches.length > 0) {
          bot.reply(message, `${benedicts[Math.floor(Math.random() * benedicts.length)]} ${cumberbatches[Math.floor(Math.random() * cumberbatches.length)]}`);
        }
      });
    });
  });
};
