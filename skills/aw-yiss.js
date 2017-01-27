/**
 * • `aw yiss <thing to be excited about>` Returns a very happy duck
 */

const got = require('got');

module.exports = controller => {
  controller.hears([/^aw yiss (.*)/i], 'direct_message,direct_mention,mention,ambient', (bot, message) => {
    const [, phrase] = message.match;

    got('http://awyisser.com/api/generator/', {
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: `phrase=${phrase}`
    }).then(response => {
      bot.reply(message, JSON.parse(response.body).link);
    }).catch(err => {
      bot.reply(message, `Aw no: ${JSON.parse(err.response.body)}`);
    });
  });
};
