/**
 * • `bukkit` Returns a random bukkit from any of the bukkitSources
 * • `bukkit <query>` Returns a random bukkit that matches the query from any of the bukkitSources
 * • `bukkit <query> from <source>` Returns a random bukkit that matches the query from source
 */
const replyHandler = require("./replyHandler");
const getReply = require("../../getReply");
const getDataFromStorage = require("../../getDataFromStorage");

module.exports = controller => {
  controller.hears(
    [/^bukkit\s?([\w-]+)?(?: from (\w+))?$/i],
    "direct_message,direct_mention,mention,ambient",
    async (bot, message) => {
      const reply = getReply(bot, message);
      const [, query, source] = message.match;

      try {
        const data = await getDataFromStorage(controller, "bukkits");
        replyHandler(reply, data, query, source);
      } catch (err) {
        reply(`Error getting bukkits: ${err}`);
      }
    }
  );
};
