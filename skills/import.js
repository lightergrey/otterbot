/**
  * • *DANGER* `@bot import <stringifiedData>` Import stringifiedData, writing over saved data
 */

module.exports = controller => {
  controller.hears(['import (.*)'], 'direct_message,direct_mention,mention', (bot, message) => {
    const string = message.match[1];

    if (!string) {
      bot.reply(message, 'I didn’t get that. I need [{ data }]');
      return;
    }

    const data = JSON.parse(string);

    data.forEach(item => {
      controller.storage.teams.save(item, err => {
        if (err) {
          bot.reply(message, `Something went wrong: ${err}`);
        }
      });
    });

    bot.reply(message, 'Imported.');
  });
};
