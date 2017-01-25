/**
  * • `@bot hello` Introduce yourself
 */

module.exports = controller => {
  controller.hears([
    '^hello',
    '^hi'
  ], 'direct_message,direct_mention,mention', (bot, message) => {
    bot.api.reactions.add({
      timestamp: message.ts,
      channel: message.channel,
      name: 'robot_face'
    }, err => {
      if (err) {
        bot.botkit.log('Failed to add emoji reaction :(', err);
      }
    });

    controller.storage.users.get(message.user, (err, user) => {
      if (err) {
        bot.reply(message, `Something went wrong: ${err}`);
        return;
      }

      if (!user) {
        bot.api.users.info({user: message.user}, (error, response) => {
          const {user} = response;

          if (!user) {
            bot.reply(message, 'Could not find user.');
            return;
          }

          controller.storage.users.save(response.user, () => {
            var reply = {
              attachments: [
                {
                  pretext: `Hello ${response.user.profile.first_name || response.user.real_name || response.user.name}, nice to meet you`,
                  color: `#${response.user.color}`,
                  fields: [
                    {
                      title: 'id',
                      value: response.user.id,
                      short: false
                    },
                    {
                      title: 'name',
                      value: response.user.name,
                      short: false
                    }
                  ],
                  thumb_url: response.user.profile.image_512
                }
              ]
            };

            bot.reply(message, reply);
            return;
          });
        });
      }

      if (user) {
        bot.reply(message, `Hello ${user.name}!!`);
      }
    });
  });
};
