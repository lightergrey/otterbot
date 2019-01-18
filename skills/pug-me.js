/**
 * • `@bot pug me` Receive a pug
 * • `@bot pug bomb <count>` Receive <count> pugs, default 5
 */

const got = require("got");

module.exports = controller => {
  controller.hears(
    [/^pug me/i],
    "direct_message,direct_mention,mention,ambient",
    (bot, message) => {
      got("http://pugme.herokuapp.com/random")
        .then(response => {
          bot.reply(message, JSON.parse(response.body).pug);
        })
        .catch(err => {
          bot.reply(message, `\`oh no\` ${err}`);
        });
    }
  );

  controller.hears(
    [/^pug bomb( (\d+))?/i],
    "direct_message,direct_mention,mention,ambient",
    (bot, message) => {
      const count = message.match[1] || 5;
      got(`http://pugme.herokuapp.com/bomb?count=${count}`)
        .then(response => {
          bot.reply(message, JSON.parse(response.body).pugs.join("\n"));
        })
        .catch(err => {
          bot.reply(message, `\`oh no\` ${err}`);
        });
    }
  );
};
