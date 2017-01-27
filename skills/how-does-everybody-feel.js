/**
 * • `@bot How does <everybody|user> feel?` Get the feels
 */

module.exports = controller => {
  controller.hears([/I (?:am )?feel(?:ing)? (.*)$/i], 'direct_message,direct_mention,mention,ambient', (bot, message) => {
    const [, feels] = message.match;
    controller.storage.users.all((err, data) => {
      if (err) {
        bot.reply(message, `Something went wrong: ${err}`);
        return;
      }

      const user = data.filter(user => user.id === message.user)[0];

      const newData = {
        feels
      };

      controller.storage.users.save(Object.assign({}, user, newData), err => {
        if (err) {
          bot.reply(message, `Something went wrong: ${err}`);
          return;
        }
      });
    });
  });

  controller.hears([/^(how's|how\sis|how\sdoes) (\w+) feel(?:ing)?\??$/i], 'direct_message,direct_mention,mention', (bot, message) => {
    const [, name] = message.match;
    controller.storage.users.all((err, data) => {
      if (err) {
        bot.reply(message, `Something went wrong: ${err}`);
        return;
      }

      const users = data.filter(user => {
        return user.name === (name === 'everybody' || name === 'everyone') ? true : name;
      })
      .filter(item => item.name)
      .filter(item => item.feels);

      bot.reply(message, users.reduce((prev, curr) => prev + `• *${curr.name}* ${curr.feels}\n`, ''));
    });
  });
};
