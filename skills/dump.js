/**
  * • `@bot dump` Dump data in file
 */

module.exports = controller => {
  controller.hears(['^dump'], 'direct_message,direct_mention,mention', (bot, message) => {
    controller.storage.teams.all((err, data) => {
      if (err) {
        bot.reply(message, `Something went wrong: ${err}`);
        return;
      }

      bot.api.files.upload({
        content: `${JSON.stringify(data.map(item => item.id), null, 2)}`,
        filename: 'ids.json',
        filetype: 'json',
        channels: message.channel
      }, err => {
        if (err) {
          bot.reply(message, `Sorry, there has been an error: ${err}`);
        }
      });
    });
  });
};
