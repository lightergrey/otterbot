/**
  * • *DANGER* `@bot shutdown` Shut @bot down
 */

module.exports = controller => {
  controller.hears(['shutdown'], 'direct_message,direct_mention,mention', (bot, message) => {
    bot.startConversation(message, (err, convo) => {
      if (err) {
        bot.reply(message, `Something went wrong: ${err}`);
        return;
      }

      convo.ask('Are you sure you want me to shutdown?', [
        {
          pattern: bot.utterances.yes,
          callback(response, convo) {
            convo.say('Bye!');
            convo.next();
            setTimeout(() => {
              process.exit(); // eslint-disable-line unicorn/no-process-exit
            }, 3000);
          }
        }, {
          pattern: bot.utterances.no,
          default: true,
          callback(response, convo) {
            convo.say('*Phew!*');
            convo.next();
          }
        }
      ]);
    });
  });
};
