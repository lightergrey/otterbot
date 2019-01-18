const scrapeIt = require("scrape-it");

const makeBukkitsFromSourceAndFileNames = (source, fileNames) => {
  return fileNames
    .filter(fileName => /\.(gif|jpg|jpeg|png)$/i.test(fileName))
    .map(fileName => ({
      source,
      fileName
    }));
};

module.exports = bukkitSources => {
  const requests = bukkitSources
    .map(item => item.replace(/^<|>$/g, ""))
    .map(source => {
      const config = {
        values: {
          listItem: "a",
          attr: "href"
        }
      };

      return scrapeIt(source, config).then(fileNames =>
        makeBukkitsFromSourceAndFileNames(source, fileNames.values)
      );
    });

  return Promise.all(requests).then(responses => {
    return [].concat(...responses);
  });
};
