require("dotenv").config();

if (!process.env.SLACK_TOKEN || !process.env.REDISCLOUD_URL) {
  console.log("Error: Specify SLACK_TOKEN and REDISCLOUD_URL in environment"); // eslint-disable-line no-console
  process.exit(1); // eslint-disable-line unicorn/no-process-exit
}

const path = require("path");
const url = require("url");
const http = require("http");
const redis = require("botkit-storage-redis");
const botkit = require("botkit");

const bukkitController = require("./src/skill/bukkit/controller");

const normalizedPath = path.join(__dirname, "skills");

const redisURL = url.parse(process.env.REDISCLOUD_URL);
const redisStorage = redis({
  namespace: "botkit-otterbot",
  host: redisURL.hostname,
  port: redisURL.port,
  auth_pass: redisURL.auth.split(":")[1] // eslint-disable-line camelcase
});

const controller = botkit.slackbot({
  debug: true,
  stats_optout: true, // eslint-disable-line camelcase
  storage: redisStorage
});

controller
  .spawn({
    token: process.env.SLACK_TOKEN
  })
  .startRTM();

require("fs")
  .readdirSync(normalizedPath)
  .forEach(file => {
    require(`./skills/${file}`)(controller); // eslint-disable-line import/no-dynamic-require
  });

bukkitController(controller);

// To keep Heroku's free dyno awake
http
  .createServer((request, response) => {
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.end("Ok, dyno is awake.");
  })
  .listen(process.env.PORT || 5000);
