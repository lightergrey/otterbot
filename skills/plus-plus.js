/**
 * • `<user>++` Give pluses
 * • `<user>--` Take pluses
 */

module.exports = controller => {
  controller.hears(
    [/^(\S+)(\+\+|--)/i],
    "direct_message,direct_mention,mention,ambient",
    (bot, message) => {
      const [, name, operation] = message.match;
      const id =
        name.match(/<@(.*)>/) && name.match(/<@(.*)>/).length
          ? name.match(/<@(.*)>/)[1]
          : null;

      const savePlusAndReply = (user, operation) => {
        const pluses = user.pluses || 0;
        const newData = {
          pluses: pluses + (operation === "++" ? 1 : -1)
        };
        const plusedUser = Object.assign({}, user, newData);

        controller.storage.users.save(plusedUser, err => {
          if (err) {
            bot.reply(message, `Something went wrong: ${err}`);
            return;
          }

          bot.reply(
            message,
            `${plusedUser.name} has ${plusedUser.pluses} plus${
              plusedUser.pluses === 1 ? "" : "es"
            }`
          );
          return;
        });
      };

      if (id) {
        controller.storage.users.get(id, (err, data) => {
          if (err) {
            bot.reply(message, `Something went wrong: ${err}`);
            return;
          }

          if (data) {
            savePlusAndReply(data, operation);
            return;
          }
        });
      }

      controller.storage.users.all((err, data) => {
        if (err) {
          bot.reply(message, `Something went wrong: ${err}`);
          return;
        }

        const user = data.filter(user => user.name === name)[0];

        if (user) {
          savePlusAndReply(user, operation);
          return;
        }

        bot.api.users.list({ presence: 0 }, (err, data) => {
          if (err) {
            bot.reply(message, `Something went wrong: ${err}`);
            return;
          }

          const user = data.members.filter(user => user.name === name)[0];

          if (user) {
            savePlusAndReply(user, operation);
            return;
          }
        });
      });
    }
  );
};
