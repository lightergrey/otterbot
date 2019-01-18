module.exports = (bot, message) => {
  return reply => {
    bot.reply(message, reply);
  };
};
