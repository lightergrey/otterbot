const replyHandler = require("./replyHandler");
const getReply = require("../../getReply");

module.exports = controller => {
  controller.hears(
    [/^bukkit\s?([\w-]+)?(?: from (\w+))?$/i],
    "direct_message,direct_mention,mention,ambient",
    (bot, message) => {
      const reply = getReply(bot, message);
      const [, query, source] = message.match;

      controller.storage.teams.get("bukkits", (err, data) => {
        if (err) {
          reply(`Error getting bukkits: ${err}`);
          return;
        }

        replyHandler(reply, data, query, source);
      });
    }
  );
};
