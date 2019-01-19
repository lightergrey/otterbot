const fuzzy = require("fuzzy");
const getRandomItem = require("../../getRandomItem");

const findRandomMatchForQuery = (bukkitItems, query, source) => {
  const matches = fuzzy
    .filter(source, bukkitItems, {
      extract: el => el.source
    })
    .map(el => (el.original ? el.original : el))
    .filter(item =>
      query ? new RegExp(query, "i").test(item.fileName) : true
    );
  return getRandomItem(matches);
};

module.exports = (reply, data, query, source) => {
  if (!data || data.values.length === 0) {
    reply("No bukkits. Try `reload bukkits`");
    return;
  }

  const bukkitItems = [].concat(...data.values);
  const match = query
    ? findRandomMatchForQuery(bukkitItems, query, source)
    : getRandomItem(bukkitItems);

  if (!match) {
    reply("Couldn’t find a match.");
    return;
  }

  reply(`${match.source}${match.fileName}`);
};
