/**
 * • `aw yiss <thing to be excited about>` Returns a very happy duck
 */

const replyHandler = require("./replyHandler");
const getReply = require("../../getReply");

module.exports = controller => {
  controller.hears(
    [/^aw yiss (.*)/i],
    "direct_message,direct_mention,mention,ambient",
    (bot, message) => {
      const reply = getReply(bot, message);
      const [, phrase] = message.match;

      replyHandler(reply, phrase);
    }
  );
};
