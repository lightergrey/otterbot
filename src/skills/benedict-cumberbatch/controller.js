/**
 * • `benedict cumberbatch` Spelling correction for a difficult name
 */
const replyHandler = require("./replyHandler");
const getReply = require("../../getReply");

module.exports = controller => {
  controller.hears(
    ["benedict cumberbatch"],
    "direct_message,direct_mention,mention,ambient",
    (bot, message) => {
      const reply = getReply(bot, message);
      controller.storage.teams.get("benedicts", (err, benedictsData) => {
        if (err) {
          reply(`Error getting benedicts: ${err}`);
          return;
        }

        controller.storage.teams.get(
          "cumberbatches",
          (err, cumberbatchesData) => {
            if (err) {
              reply(`Error getting cumberbatches: ${err}`);
              return;
            }

            replyHandler(reply, benedictsData, cumberbatchesData);
          }
        );
      });
    }
  );
};
