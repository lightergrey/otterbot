/*
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
             ______     ______     ______   __  __     __     ______
            /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
            \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
             \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
              \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


  This is a sample Slack bot built with Botkit.

  This bot demonstrates many of the core features of Botkit:

  * Connect to Slack using the real time API
  * Receive messages based on "spoken" patterns
  * Reply to messages
  * Use the conversation system to ask questions
  * Use the built in storage system to store and retrieve information
    for a user.

  # RUN THE BOT:

    Get a Bot token from Slack:

      -> http://my.slack.com/services/new/bot

    Run your bot from the command line:

      token=<MY TOKEN> node slack_bot.js

  # USE THE BOT:

    Find your bot inside Slack to send it a direct message.

    Say: "Hello"

    The bot will reply "Hello!"

    Say: "who are you?"

    The bot will tell you its name, where it is running, and for how long.

    Say: "Call me <nickname>"

    Tell the bot your nickname. Now you are friends.

    Say: "who am I?"

    The bot will tell you your nickname, if it knows one for you.

    Say: "shutdown"

    The bot will ask if you are sure, and then shut itself down.

    Make sure to invite your bot into other channels using /invite @<my bot>!

  # EXTEND THE BOT:

    Botkit has many features for building cool and useful bots!

    Read all about it here:

      -> http://howdy.ai/botkit

  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*/

require('dotenv').config();

if (!process.env.SLACK_TOKEN) {
  console.log('Error: Specify token in environment'); // eslint-disable-line no-console
  process.exit(1);
}

const botkit = require('botkit');
const path = require('path');
const redis = require('botkit-storage-redis');
const url = require('url');
const http = require('http');

const normalizedPath = path.join(__dirname, 'scripts');

const redisURL = url.parse(process.env.REDISCLOUD_URL);
const redisStorage = redis({
  namespace: 'botkit-otterbot',
  host: redisURL.hostname,
  port: redisURL.port,
  auth_pass: redisURL.auth.split(':')[1],
});

const controller = botkit.slackbot({
  debug: true,
  stats_optout: true,
  storage: redisStorage,
});

controller.spawn({
  token: process.env.SLACK_TOKEN,
}).startRTM();

require('fs').readdirSync(normalizedPath).forEach((file) => {
  require(`./scripts/${file}`)(controller);
});

// To keep Heroku's free dyno awake
http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' });
  response.end('Ok, dyno is awake.');
}).listen(process.env.PORT || 5000);
