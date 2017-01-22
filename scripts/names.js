module.exports = (controller) => {
  controller.hears([
    'call me (.*)',
    'my name is (.*)',
  ], 'direct_message,direct_mention,mention', (bot, message) => {
    const name = message.match[1];
    controller.storage.users.get(message.user, (err, user) => {
      const newData = {
        id: message.user,
        name,
      };

      controller.storage.users.save(Object.assign({}, user, newData), () => {
        bot.reply(message, `Got it. I will call you ${name} from now on.`);
      });
    });
  });

  controller.hears([
    'what is my name',
    'who am i',
  ], 'direct_message,direct_mention,mention', (bot, message) => {
    controller.storage.users.get(message.user, (err, user) => {
      if (user && user.name) {
        bot.reply(message, `Your name is ${user.name}`);
        return;
      }

      bot.startConversation(message, (err, convo) => {
        if (!err) {
          convo.say('I do not know your name yet!');
          convo.ask('What should I call you?', (response, convo) => {
            convo.ask(`You want me to call you \`${response.text}\`?`, [
              {
                pattern: 'yes',
                callback(response, convo) {
                  // since no further messages are queued after this,
                  // the conversation will end naturally with status == 'completed'
                  convo.next();
                },
              }, {
                pattern: 'no',
                callback(response, convo) {
                  // stop the conversation. this will cause it to end with status == 'stopped'
                  convo.stop();
                },
              }, {
                default: true,
                callback(response, convo) {
                  convo.repeat();
                  convo.next();
                },
              },
            ]);

            convo.next();
          }, { key: 'nickname' }); // store the results in a field called nickname

          convo.on('end', (convo) => {
            if (convo.status === 'completed') {
              bot.reply(message, 'OK! I will update my dossier...');

              controller.storage.users.get(message.user, (err, user) => {
                const newData = {
                  id: message.user,
                  name: convo.extractResponse('nickname'),
                };

                controller.storage.users.save(Object.assign({}, user, newData), () => {
                  bot.reply(message, `Got it. I will call you ${user.name} from now on.`);
                });
              });
            } else {
              // this happens if the conversation ended prematurely for some reason
              bot.reply(message, 'OK, nevermind!');
            }
          });
        }
      });
    });
  });
};
