/**
 * • `@bot uptime` Get details on @bot
 */

const os = require("os");

module.exports = controller => {
  const formatUptime = uptime => {
    let unit = "second";
    if (uptime > 60) {
      uptime /= 60;
      unit = "minute";
    }
    if (uptime > 60) {
      uptime /= 60;
      unit = "hour";
    }
    if (uptime !== 1) {
      unit = `${unit}s`;
    }

    uptime = `${uptime} ${unit}`;
    return uptime;
  };

  controller.hears(
    ["uptime", "identify yourself", "who are you", "what is your name"],
    "direct_message,direct_mention,mention",
    (bot, message) => {
      const hostname = os.hostname();
      const uptime = formatUptime(process.uptime());

      bot.reply(
        message,
        `:robot_face: I am a bot named <@${
          bot.identity.name
        }>. I have been running for ${uptime} on ${hostname}.`
      );
    }
  );
};
