/**
 * • `@bot tell me about <user>` Get profile for user
 */

module.exports = controller => {
  const formatAttachmentForUser = user => {
    return {
      attachments: [
        {
          color: `#${user.color}`,
          fields: [
            {
              title: "id",
              value: user.id,
              short: false
            },
            {
              title: "name",
              value: user.name,
              short: false
            },
            {
              title: "pluses",
              value: user.pluses || 0,
              short: false
            },
            {
              title: "feels",
              value: user.feels || "",
              short: false
            }
          ],
          thumb_url: user.profile.image_512
        }
      ]
    };
  };

  controller.hears(
    [/^tell me about (\w+)/i],
    "direct_message,direct_mention,mention",
    (bot, message) => {
      const name = message.match[1];

      controller.storage.users.all((err, data) => {
        if (err) {
          bot.reply(message, `Something went wrong: ${err}`);
          return;
        }

        const user = data.filter(user => user.name === name)[0];

        if (!user) {
          bot.api.users.list({ presence: 0 }, (error, response) => {
            if (err) {
              bot.reply(message, `Something went wrong: ${err}`);
              return;
            }

            const user = response.members.filter(user => user.name === name)[0];

            if (!user) {
              bot.reply(message, "Could not find user.");
              return;
            }

            if (user) {
              controller.storage.users.save(user, saveErr => {
                if (saveErr) {
                  bot.reply(message, `Something went wrong: ${err}`);
                  return;
                }

                bot.reply(message, formatAttachmentForUser(user));
              });
            }
          });
        }

        if (user) {
          bot.reply(message, formatAttachmentForUser(user));
        }
      });
    }
  );
};
