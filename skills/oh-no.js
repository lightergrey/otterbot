/**
 * • `oh no` oh no
 */

module.exports = controller => {
  controller.hears(
    ["oh no"],
    "direct_message,direct_mention,mention,ambient",
    (bot, message) => {
      bot.reply(message, "`oh no`");
    }
  );
};
