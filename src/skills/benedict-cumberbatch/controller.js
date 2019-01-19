/**
 * • `benedict cumberbatch` Spelling correction for a difficult name
 */
const replyHandler = require("./replyHandler");
const getReply = require("../../getReply");
const getDataFromStorage = require("../../getDataFromStorage");

module.exports = controller => {
  controller.hears(
    ["benedict cumberbatch"],
    "direct_message,direct_mention,mention,ambient",
    async (bot, message) => {
      const reply = getReply(bot, message);

      try {
        const benedictsData = await getDataFromStorage(controller, "benedicts");
        const cumberbatchesData = await getDataFromStorage(
          controller,
          "cumberbatches"
        );
        replyHandler(reply, benedictsData, cumberbatchesData);
      } catch (err) {
        reply(`Error getting benedicts or cumberbatches: ${err}`);
      }
    }
  );
};
