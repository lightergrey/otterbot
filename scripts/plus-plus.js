/**
 * • `<user>++` Give pluses
 * • `<user>--` Take pluses
 */

module.exports = controller => {
  const setPlusesForUser = (user, operation) => {
    const pluses = user.pluses || 0;

    const newData = {
      pluses: pluses + ((operation === '++') ? 1 : -1)
    };

    return Object.assign({}, user, newData);
  };

  controller.hears([/^(\S+)(\+\+|--)/i], 'direct_message,direct_mention,mention,ambient', (bot, message) => {
    const [, name, operation] = message.match;

    controller.storage.users.all((err, data) => {
      if (err) {
        bot.reply(message, `Something went wrong: ${err}`);
        return;
      }

      const user = data.filter(user => user.name === name)[0];

      if (!user) {
        bot.api.users.list({presence: 0}, (error, response) => {
          if (err) {
            bot.reply(message, `Something went wrong: ${err}`);
            return;
          }

          const user = response.members.filter(user => user.name === name)[0];

          if (!user) {
            bot.reply(message, 'Could not find user.');
            return;
          }

          if (user) {
            const plusedUser = setPlusesForUser(user, operation);

            controller.storage.users.save(plusedUser, saveErr => {
              if (saveErr) {
                bot.reply(message, `Something went wrong: ${err}`);
                return;
              }

              bot.reply(message, `${plusedUser.name} has ${plusedUser.pluses}`);
            });
          }
        });
      }

      if (user) {
        const plusedUser = setPlusesForUser(user, operation);

        controller.storage.users.save(plusedUser, saveErr => {
          if (saveErr) {
            bot.reply(message, `Something went wrong: ${err}`);
            return;
          }

          bot.reply(message, `${plusedUser.name} has ${plusedUser.pluses}`);
        });
      }
    });
  });
};
