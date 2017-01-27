/**
  * • `@bot delete me` Delete your record
 */

module.exports = controller => {
  controller.hears(['^delete me'], 'direct_message,direct_mention,mention', (bot, message) => {
    bot.startConversation(message, (err, convo) => {
      if (err) {
        bot.reply(message, `Something went wrong: ${err}`);
        return;
      }

      convo.ask('Are you sure? Say `delete` to delete.', [
        {
          pattern: 'delete',
          callback(response, convo) {
            controller.storage.users.remove(message.user, err => {
              if (err) {
                bot.reply(message, `Something went wrong: ${err}`);
                return;
              }

              convo.say('Deleted. Say `hi` if you change your mind.');
              convo.next();
            });
          }
        }, {
          pattern: bot.utterances.no,
          default: true,
          callback(response, convo) {
            convo.say('Phew! Not deleted.');
            convo.next();
          }
        }
      ]);
    });
  });
};
