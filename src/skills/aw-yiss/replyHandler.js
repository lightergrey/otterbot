const got = require("got");

module.exports = async (reply, phrase) => {
  try {
    const response = await got("http://awyisser.com/api/generator/", {
      headers: {
        "content-type": "application/x-www-form-urlencoded"
      },
      body: `phrase=${phrase}`
    });
    reply(JSON.parse(response.body).link);
  } catch (error) {
    reply(`Aw no: ${error.body}`);
  }
};
