module.exports = (controller) => {
  controller.hears([/^learn (.*) \| (.*)/i], 'direct_message,direct_mention,mention', (bot, message) => {
    const id = message.match[1];
    const value = message.match[2];

    if (!id || !value) {
      bot.reply(message, 'I didn’t get that. I need a <id> | <value>');
      return;
    }

    controller.storage.teams.get(id, (err, data) => {
      if (err) {
        bot.reply(message, `Something went wrong: ${err}`);
        return;
      }

      const newData = {
        id,
        values: [].concat(...(data ? data.values : []), value),
      };

      controller.storage.teams.save(Object.assign({}, data, newData), (saveErr) => {
        if (saveErr) {
          bot.reply(message, `Something went wrong: ${err}`);
          return;
        }

        bot.reply(message, `Learned ${id}: ${value}`);
      });
    });
  });

  controller.hears([/^forget (.*)/], 'direct_message,direct_mention,mention', (bot, message) => {
    const id = message.match[1];

    if (!id) {
      bot.reply(message, 'I didn’t get that. I need an <id>');
      return;
    }

    controller.storage.teams.remove(id, (err) => {
      if (err) {
        bot.reply(message, `Something went wrong: ${err}`);
        return;
      }

      bot.reply(message, 'Forgot it');
    });
  });

  controller.hears([/^list (.*)/], 'direct_message,direct_mention,mention', (bot, message) => {
    const id = message.match[1];

    if (!id) {
      bot.reply(message, 'I didn’t get that. I need an <id>');
      return;
    }

    controller.storage.teams.get(id, (err, data) => {
      if (err) {
        bot.reply(message, `Something went wrong: ${err}`);
        return;
      }

      if (!data) {
        bot.reply(message, `Couldn’t find id:${id}`);
        return;
      }

      bot.reply(message, JSON.stringify(data.values));
    });
  });

  controller.hears([/^\?(.*)/], 'direct_message,direct_mention,mention', (bot, message) => {
    const id = message.match[1];

    if (!id) {
      bot.reply(message, 'I didn’t get that. I need an <id>');
      return;
    }

    controller.storage.teams.get(id, (err, data) => {
      if (err) {
        bot.reply(message, `Something went wrong: ${err}`);
        return;
      }

      if (!data) {
        bot.reply(message, `Couldn’t find id:${id}`);
        return;
      }

      const i = Math.floor(Math.random() * data.values.length);

      bot.reply(message, data.values[i]);
    });
  });

  controller.hears(['^dump (.*)'], 'direct_message,direct_mention,mention', (bot, message) => {
    const id = message.match[1];
    controller.storage.teams.get(id, (err, data) => {
      if (err) {
        bot.reply(message, `Something went wrong: ${err}`);
        return;
      }

      bot.api.files.upload({
        content: `${JSON.stringify(data, null, 2)}`,
        filename: `${id}.json`,
        filetype: 'json',
        channels: message.channel,
      }, (err) => {
        if (err) {
          bot.reply(message, `Sorry, there has been an error: ${err}`);
        }
      });
    });
  });

  controller.hears(['^?list (.*)'], 'direct_message,direct_mention,mention', (bot, message) => {
    const id = message.match[1];
    controller.storage.teams.get(id, (err, data) => {
      if (err) {
        bot.reply(message, `Something went wrong: ${err}`);
        return;
      }

      bot.reply(message, JSON.stringify(data.values));
    });
  });

  controller.hears(['^dump'], 'direct_message,direct_mention,mention', (bot, message) => {
    controller.storage.teams.all((err, data) => {
      if (err) {
        bot.reply(message, `Something went wrong: ${err}`);
        return;
      }

      bot.api.files.upload({
        content: `${JSON.stringify(data.map(item => item.id), null, 2)}`,
        filename: 'ids.json',
        filetype: 'json',
        channels: message.channel,
      }, (err) => {
        if (err) {
          bot.reply(message, `Sorry, there has been an error: ${err}`);
        }
      });
    });
  });

  controller.hears(['import (.*)'], 'direct_message,direct_mention,mention', (bot, message) => {
    const string = message.match[1];

    if (!string) {
      bot.reply(message, 'I didn’t get that. I need [{ data }]');
      return;
    }

    const data = JSON.parse(string);

    data.forEach((item) => {
      controller.storage.teams.save(item, (err) => {
        if (err) {
          bot.reply(message, `Something went wrong: ${err}`);
        }
      });
    });

    bot.reply(message, 'Imported.');
  });
};
