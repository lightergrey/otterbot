const getRandomItem = require("../../getRandomItem");

module.exports = (reply, benedictsData, cumberbatchesData) => {
  if (!benedictsData || benedictsData.values.length === 0) {
    reply("No benedicts.");
    return;
  }

  if (!cumberbatchesData || cumberbatchesData.values.length === 0) {
    reply("No cumberbatches.");
    return;
  }

  const benedict = getRandomItem(benedictsData.values);
  const cumberbatch = getRandomItem(cumberbatchesData.values);

  reply(`${benedict} ${cumberbatch}`);
};
