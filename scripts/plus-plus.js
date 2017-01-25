/**
 * • `<user>++` Give pluses
 * • `<user>--` Take pluses
 */

module.exports = controller => {
  controller.hears([/^(\S+)(\+\+|--)/i], 'direct_message,direct_mention,mention,ambient', (bot, message) => {
    const [, name, operation] = message.match;

    bot.api.users.list({presence: 0}, (error, response) => {
      const user = response.members.filter(member => member.name === name)[0];

      if (!user) {
        bot.reply(message, `Couldn’t find user ${name}`);
        return;
      }

      controller.storage.users.get(user.id, (err, data) => {
        if (err) {
          bot.reply(message, `Something went wrong: ${err}`);
          return;
        }

        const pluses = data && data.pluses ? data.pluses : 0;

        const newData = {
          id: user.id,
          pluses: pluses + ((operation === '++') ? 1 : -1)
        };

        controller.storage.users.save(Object.assign({}, data, newData), saveErr => {
          if (saveErr) {
            bot.reply(message, `Something went wrong: ${err}`);
            return;
          }

          bot.reply(message, `${user.name} has ${newData.pluses}`);
        });
      });
    });
  });
};
