const fs = require('fs');
const extract = require('extract-comments');

module.exports = controller => {
  controller.hears(['help'], 'direct_message,direct_mention,mention', (bot, message) => {
    const allComments = fs.readdirSync(__dirname)
    .map(file => {
      const fileComments = extract.block(fs.readFileSync(`${__dirname}/${file}`, 'utf8'), {first: true});
      return fileComments.length ? fileComments.map(item => item.value)[0] : null;
    })
    .filter(item => item).join('')
    .replace(/@bot/g, `@${bot.identity.name}`);

    bot.reply(message, allComments);
  });
};
